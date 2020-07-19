/*
Name: jsDate
Desc: VBScript native Date functions emulated for Javascript
Author: Rob Eberhardt, Slingshot Solutions - http://slingfive.com/
Note: see jsDate.txt for more info
*/

// constants
const vbGeneralDate=0, vbLongDate=1, vbShortDate=2, vbLongTime=3, vbShortTime=4;  // NamedFormat
const vbUseSystemDayOfWeek=0, vbSunday=1, vbMonday=2, vbTuesday=3, vbWednesday=4, vbThursday=5, vbFriday=6, vbSaturday=7;	// FirstDayOfWeek
const vbUseSystem=0, vbFirstJan1=1, vbFirstFourDays=2, vbFirstFullWeek=3;	// FirstWeekOfYear

// arrays (1-based)
const MonthNames = [null,'January','February','March','April','May','June','July','August','September','October','November','December'];
const WeekdayNames = [null,'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

type DateLike = string | Date;


function IsDate(p_Expression: DateLike): boolean {
    if(p_Expression===null){return false;}
    if(p_Expression instanceof Date) return true;
	return !isNaN(Date.parse(p_Expression));		// <-- review further
}

function CDate(p_Date: DateLike): Date {
    if(p_Date instanceof Date) return p_Date;

    if (!isNaN(Date.parse(p_Date))) {       // <-- review further
        return new Date(Date.parse(p_Date));	 // <-- review further
    }

	var strTry = p_Date.replace(/\-/g, '/').replace(/\./g, '/').replace(/ /g, '/');	// fix separators
	strTry = strTry.replace(/pm$/i, " pm").replace(/am$/i, " am");	// and meridian spacing
	if(IsDate(strTry)){ return new Date(strTry); }

	var strTryYear = strTry + '/' + new Date().getFullYear();	// append year
	if(IsDate(strTryYear)){ return new Date(strTryYear); }


	if(strTry.indexOf(":")){	// if appears to have time
		var strTryYear2 = strTry.replace(/ /, '/' + new Date().getFullYear() + ' ');	// insert year
		if(IsDate(strTryYear2)){ return new Date(strTryYear2); }

		var strTryDate = new Date().toDateString() + ' ' + p_Date;	// pre-pend current date
		if(IsDate(strTryDate)){ return new Date(strTryDate); }
	}

	throw("Error #13 - Type mismatch");
}



function DateAdd(p_Interval: string, p_Number: number, p_Date: DateLike): Date {
	if(!CDate(p_Date)){	throw "invalid date: '" + p_Date + "'";	}
	if(isNaN(p_Number)){	throw "invalid number: '" + p_Number + "'";	}

	p_Number = Number(p_Number);
	var dt = CDate(p_Date);

	switch(p_Interval.toLowerCase()){
		case "yyyy": {
			dt.setFullYear(dt.getFullYear() + p_Number);
			break;
		}
		case "q": {
			dt.setMonth(dt.getMonth() + (p_Number*3));
			break;
		}
		case "m": {
			dt.setMonth(dt.getMonth() + p_Number);
			break;
		}
		case "y":			// day of year
		case "d":			// day
		case "w": {		// weekday
			dt.setDate(dt.getDate() + p_Number);
			break;
		}
		case "ww": {	// week of year
			dt.setDate(dt.getDate() + (p_Number*7));
			break;
		}
		case "h": {
			dt.setHours(dt.getHours() + p_Number);
			break;
		}
		case "n": {		// minute
			dt.setMinutes(dt.getMinutes() + p_Number);
			break;
		}
		case "s": {
			dt.setSeconds(dt.getSeconds() + p_Number);
			break;
		}
		case "ms": {	// JS extension
			dt.setMilliseconds(dt.getMilliseconds() + p_Number);
			break;
		}
		default: {
			throw "invalid interval: '" + p_Interval + "'";
		}
	}
	return dt;
}



function DateDiff(p_Interval: string, p_Date1: DateLike, p_Date2: DateLike, p_FirstDayOfWeek?: number): number {
	if(!CDate(p_Date1)){	throw "invalid date: '" + p_Date1 + "'";	}
	if(!CDate(p_Date2)){	throw "invalid date: '" + p_Date2 + "'";	}
	p_FirstDayOfWeek = ((!p_FirstDayOfWeek) || p_FirstDayOfWeek==0) ? vbSunday : p_FirstDayOfWeek;	// set default

	var dt1 = CDate(p_Date1);
	var dt2 = CDate(p_Date2);

	// correct DST-affected intervals ("d" & bigger)
	if("h,n,s,ms".indexOf(p_Interval.toLowerCase())==-1){
		if(p_Date1.toString().indexOf(":") ==-1){ dt1.setUTCHours(0,0,0,0) };	// no time, assume 12am
		if(p_Date2.toString().indexOf(":") ==-1){ dt2.setUTCHours(0,0,0,0) };	// no time, assume 12am
	}


	// get ms between UTC dates and make into "difference" date
	var iDiffMS = dt2.valueOf() - dt1.valueOf();
	var dtDiff = new Date(iDiffMS);

	// calc various diffs
	var nYears  = dt2.getUTCFullYear() - dt1.getUTCFullYear();
	var nMonths = dt2.getUTCMonth() - dt1.getUTCMonth() + (nYears!=0 ? nYears*12 : 0);
	var nQuarters = Math.floor(nMonths / 3);	//<<-- different than VBScript, which watches rollover not completion

	var nMilliseconds = iDiffMS;
	var nSeconds = Math.floor(iDiffMS / 1000);
	var nMinutes = Math.floor(nSeconds / 60);
	var nHours = Math.floor(nMinutes / 60);
	var nDays  = Math.floor(nHours / 24);	// <-- now fixed for DST switch days
	var nWeeks = Math.floor(nDays / 7);

    let nCalWeeks: number | null = null;

	if(p_Interval.toLowerCase()=='ww'){
			// set dates to 1st & last FirstDayOfWeek
			var offset = DatePart("w", dt1, p_FirstDayOfWeek)-1;
			if(offset){	dt1.setDate(dt1.getDate() +7 -offset);	}
			var offset = DatePart("w", dt2, p_FirstDayOfWeek)-1;
			if(offset){	dt2.setDate(dt2.getDate() -offset);	}
			// recurse to "w" with adjusted dates
			nCalWeeks = DateDiff("w", dt1, dt2) + 1;
	}
	// TODO: similar for 'w'?


	// return difference
	switch(p_Interval.toLowerCase()){
		case "yyyy": return nYears;
		case "q": return nQuarters;
		case "m":	return nMonths;
		case "y":			// day of year
		case "d": return nDays;
		case "w": return nWeeks;
		case "ww":return nCalWeeks!; // week of year
		case "h": return nHours;
		case "n": return nMinutes;
		case "s": return nSeconds;
		case "ms":return nMilliseconds;	// not in VBScript
		default : throw "invalid interval: '" + p_Interval + "'";
	}
}




function DatePart(p_Interval: string, p_Date: DateLike, p_FirstDayOfWeek?: number): number {
	if(!CDate(p_Date)){	throw "invalid date: '" + p_Date + "'";	}

	var dtPart = CDate(p_Date);

	switch(p_Interval.toLowerCase()){
		case "yyyy": return dtPart.getFullYear();
		case "q": return Math.floor(dtPart.getMonth() / 3) + 1;
		case "m": return dtPart.getMonth() + 1;
		case "y": return DateDiff("y", "1/1/" + dtPart.getFullYear(), dtPart) + 1;	// day of year
		case "d": return dtPart.getDate();
		case "w": return Weekday(dtPart.getDay()+1, p_FirstDayOfWeek);		// weekday
		case "ww":return DateDiff("ww", "1/1/" + dtPart.getFullYear(), dtPart, p_FirstDayOfWeek) + 1;	// week of year
		case "h": return dtPart.getHours();
		case "n": return dtPart.getMinutes();
		case "s": return dtPart.getSeconds();
		case "ms":return dtPart.getMilliseconds();	// <-- JS extension, NOT in VBScript
		default : throw "invalid interval: '" + p_Interval + "'";
	}
}


type Monthlike = number | DateLike;

function MonthName(p_Month: Monthlike, p_Abbreviate?: boolean): string {
    if (typeof(p_Month) !== 'number') { // v0.94- compat: extract real param from passed date
        p_Month = DatePart("m", CDate(p_Month));
    }

	var retVal = MonthNames[p_Month]!;
	if(p_Abbreviate){	retVal = retVal.substring(0, 3)	}	// abbr to 3 chars
	return retVal;
}


type WeekdayLike = number | DateLike;

function WeekdayName(p_Weekday: WeekdayLike, p_Abbreviate?: boolean, p_FirstDayOfWeek?: number): string {
    if (typeof(p_Weekday) !== 'number') { // v0.94- compat: extract real param from passed date
        p_Weekday = DatePart("w", CDate(p_Weekday));
    }
	p_FirstDayOfWeek = ((!p_FirstDayOfWeek) || p_FirstDayOfWeek==0) ? vbSunday : p_FirstDayOfWeek;	// set default

	var nWeekdayNameIdx = ((p_FirstDayOfWeek-1 + p_Weekday-1 +7) % 7) + 1;	// compensate nWeekdayNameIdx for p_FirstDayOfWeek
	var retVal = WeekdayNames[nWeekdayNameIdx]!;
	if(p_Abbreviate){	retVal = retVal.substring(0, 3)	}	// abbr to 3 chars
	return retVal;
}


// adjusts weekday for week starting on p_FirstDayOfWeek
function Weekday(p_Weekday: number, p_FirstDayOfWeek?: number){
	p_FirstDayOfWeek = ((!p_FirstDayOfWeek) || p_FirstDayOfWeek==0) ? vbSunday : p_FirstDayOfWeek;	// set default

	return ((p_Weekday - p_FirstDayOfWeek +7) % 7) + 1;
}






function FormatDateTime(p_Date: DateLike, p_NamedFormat?: number){
	if((typeof(p_Date)==='string') && (p_Date.toUpperCase().substring(0,3) == "NOW")){	p_Date = new Date()	};
	if(!CDate(p_Date)){	throw "invalid date: '" + p_Date + "'";	}
	if(!p_NamedFormat){	p_NamedFormat = vbGeneralDate	};

	var dt = CDate(p_Date);

	switch(p_NamedFormat){
		case vbGeneralDate: return dt.toString();
		case vbLongDate:		return Format(p_Date, 'DDDD, MMMM D, YYYY');
		case vbShortDate:		return Format(p_Date, 'MM/DD/YYYY');
		case vbLongTime:		return dt.toLocaleTimeString();
		case vbShortTime:		return Format(p_Date, 'HH:MM:SS');
		default:	throw "invalid NamedFormat: '" + p_NamedFormat + "'";
	}
}


function Format(p_Date: DateLike, p_Format: string, p_FirstDayOfWeek?: number, p_firstweekofyear?: number) {
	if(!CDate(p_Date)){	throw "invalid date: '" + p_Date + "'";	}
	if(!p_Format || p_Format==''){	return p_Date.toString();	};

	var dt = CDate(p_Date);

	// Zero-padding formatter
	function pad(p_str: string){
		if(p_str.toString().length==1){p_str = '0' + p_str}
		return p_str;
	}

	var ampm = dt.getHours()>=12 ? 'PM' : 'AM'
	var hr = dt.getHours();
	if (hr == 0){hr = 12};
	if (hr > 12) {hr -= 12};
	var strShortTime = hr +':'+ pad(dt.getMinutes().toString()) +':'+ pad(dt.getSeconds().toString()) +' '+ ampm;
	var strShortDate = (dt.getMonth()+1) +'/'+ dt.getDate() +'/'+ new String( dt.getFullYear() ).substring(2,4);
	var strLongDate = MonthName(dt.getMonth()+1) +' '+ dt.getDate() +', '+ dt.getFullYear();		//

	var retVal = p_Format;

	// switch tokens whose alpha replacements could be accidentally captured
	retVal = retVal.replace( new RegExp('C', 'gi'), 'CCCC' );
	retVal = retVal.replace( new RegExp('mmmm', 'gi'), 'XXXX' );
	retVal = retVal.replace( new RegExp('mmm', 'gi'), 'XXX' );
	retVal = retVal.replace( new RegExp('dddddd', 'gi'), 'AAAAAA' );
	retVal = retVal.replace( new RegExp('ddddd', 'gi'), 'AAAAA' );
	retVal = retVal.replace( new RegExp('dddd', 'gi'), 'AAAA' );
	retVal = retVal.replace( new RegExp('ddd', 'gi'), 'AAA' );
	retVal = retVal.replace( new RegExp('timezone', 'gi'), 'ZZZZ' );
	retVal = retVal.replace( new RegExp('time24', 'gi'), 'TTTT' );
	retVal = retVal.replace( new RegExp('time', 'gi'), 'TTT' );

	// now do simple token replacements
	retVal = retVal.replace( new RegExp('yyyy', 'gi'), dt.getFullYear().toString() );
	retVal = retVal.replace( new RegExp('yy', 'gi'), new String( dt.getFullYear() ).substring(2,4) );
	retVal = retVal.replace( new RegExp('y', 'gi'), DatePart("y", dt).toString() );
	retVal = retVal.replace( new RegExp('q', 'gi'), DatePart("q", dt).toString() );
	retVal = retVal.replace( new RegExp('mm', 'gi'), pad((dt.getMonth() + 1).toString()) );
	retVal = retVal.replace( new RegExp('m', 'gi'), (dt.getMonth() + 1).toString() );
	retVal = retVal.replace( new RegExp('dd', 'gi'), pad(dt.getDate().toString()) );
	retVal = retVal.replace( new RegExp('d', 'gi'), dt.getDate().toString() );
	retVal = retVal.replace( new RegExp('hh', 'gi'), pad(dt.getHours().toString()) );
	retVal = retVal.replace( new RegExp('h', 'gi'), dt.getHours().toString() );
	retVal = retVal.replace( new RegExp('nn', 'gi'), pad(dt.getMinutes().toString()) );
	retVal = retVal.replace( new RegExp('n', 'gi'), dt.getMinutes().toString() );
	retVal = retVal.replace( new RegExp('ss', 'gi'), pad(dt.getSeconds().toString()) );
	retVal = retVal.replace( new RegExp('s', 'gi'), dt.getSeconds().toString() );
	retVal = retVal.replace( new RegExp('t t t t t', 'gi'), strShortTime );
	retVal = retVal.replace( new RegExp('am/pm', 'g'), dt.getHours()>=12 ? 'pm' : 'am');
	retVal = retVal.replace( new RegExp('AM/PM', 'g'), dt.getHours()>=12 ? 'PM' : 'AM');
	retVal = retVal.replace( new RegExp('a/p', 'g'), dt.getHours()>=12 ? 'p' : 'a');
	retVal = retVal.replace( new RegExp('A/P', 'g'), dt.getHours()>=12 ? 'P' : 'A');
	retVal = retVal.replace( new RegExp('AMPM', 'g'), dt.getHours()>=12 ? 'pm' : 'am');
	// (always proceed largest same-lettered token to smallest)

	// now finish the previously set-aside tokens
	retVal = retVal.replace( new RegExp('XXXX', 'gi'), MonthName(dt.getMonth()+1, false) );	//
	retVal = retVal.replace( new RegExp('XXX',  'gi'), MonthName(dt.getMonth()+1, true ) );	//
	retVal = retVal.replace( new RegExp('AAAAAA', 'gi'), strLongDate );
	retVal = retVal.replace( new RegExp('AAAAA', 'gi'), strShortDate );
	retVal = retVal.replace( new RegExp('AAAA', 'gi'), WeekdayName(dt.getDay()+1, false, p_FirstDayOfWeek) );	//
	retVal = retVal.replace( new RegExp('AAA',  'gi'), WeekdayName(dt.getDay()+1, true,  p_FirstDayOfWeek) );	//
	retVal = retVal.replace( new RegExp('TTTT', 'gi'), dt.getHours() + ':' + pad(dt.getMinutes().toString()) );
	retVal = retVal.replace( new RegExp('TTT',  'gi'), hr +':'+ pad(dt.getMinutes().toString()) +' '+ ampm );
	retVal = retVal.replace( new RegExp('CCCC', 'gi'), strShortDate +' '+ strShortTime );

	// finally timezone
	const tz = dt.getTimezoneOffset();
	const timezone = (tz<0) ? ('GMT-' + tz/60) : (tz==0) ? ('GMT') : ('GMT+' + tz/60);
	retVal = retVal.replace( new RegExp('ZZZZ', 'gi'), timezone );

	return retVal;
}

export { IsDate, CDate, DateAdd, DateDiff, DatePart, MonthName, WeekdayName, Weekday, FormatDateTime, Format }
