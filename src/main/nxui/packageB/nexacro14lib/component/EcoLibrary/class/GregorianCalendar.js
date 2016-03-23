/**
 * @fileoverview
 * TimeUnit, GregorianCalendar Class 정의<br>
 * TimeUnit.MILLISECOND TimeUnit객체 생성<br>
 * TimeUnit.SECOND TimeUnit객체 생성<br>
 * TimeUnit.MINUTE TimeUnit객체 생성<br>
 * TimeUnit.HOUR TimeUnit객체 생성<br>
 * TimeUnit.DAY TimeUnit객체 생성<br>
 * TimeUnit.YEAR TimeUnit객체 생성<br>
 * TimeUnit.WEEK TimeUnit객체 생성<br>
 * TimeUnit.MONTH TimeUnit객체 생성<br>
 * TimeUnit.QUARTER TimeUnit객체 생성<br>
 * TimeUnit.HALFYEAR TimeUnit객체 생성<br>
 * TimeUnit.DECADE TimeUnit객체 생성<br>
 * TimeUnit.HOUR_CALENDAR TimeUnit객체 생성
*/

if ( !JsNamespace.exist("Eco.TimeUnit") )
{
	/**
	 * @class TimeUnit
	 * @classdesc name, milliseconds property를 가지는 TimeUnit Class.
		unit별로 millisecond값을 가지는 객체이다.
		예를 들면 TimeUnit.SECOND이면 name: second, millisecond: 1000 값을 가지는 객체가 된다.
	*/
	JsNamespace.declareClass("Eco.TimeUnit", {
		initialize: function(nm, timeUnit)
		{
			this.name = nm;
			this.milliseconds = timeUnit;
		},
		properties: {
			name: {},
			milliseconds: {}
		},
		toString: function()
		{
			return this.name;
		}
	}); //end of 'JsNamespace.declareClass("TimeUnit", {'

	TimeUnit.MILLISECOND = new TimeUnit("millisecond", 1);
	TimeUnit.SECOND = new TimeUnit("second", 1000);
	TimeUnit.MINUTE = new TimeUnit("minute", 60 * 1000);
	TimeUnit.HOUR = new TimeUnit("hour (elapsed)", 60 * TimeUnit.MINUTE.milliseconds);
	TimeUnit.DAY = new TimeUnit("day", 24 * TimeUnit.HOUR.milliseconds);
	TimeUnit.YEAR = new TimeUnit("year", 366 * TimeUnit.DAY.milliseconds);
	TimeUnit.WEEK = new TimeUnit("week", 7 * TimeUnit.DAY.milliseconds);
	TimeUnit.MONTH = new TimeUnit("month", 31 * TimeUnit.DAY.milliseconds);
	TimeUnit.QUARTER = new TimeUnit("quarter", (2 * 31 + 30) * TimeUnit.DAY.milliseconds);
	TimeUnit.HALFYEAR = new TimeUnit("half-year", (4 * 31 + 2 * 30) * TimeUnit.DAY.milliseconds);
	TimeUnit.DECADE = new TimeUnit("decade", (8 * 366 + 2 * 365) * TimeUnit.DAY.milliseconds);
	TimeUnit.HOUR_CALENDAR = new TimeUnit("hour (calendar)", 60 * TimeUnit.MINUTE.milliseconds);
} //end of 'if ( !JsNamespace.exist("TimeUnit") )'


if ( !JsNamespace.exist("Eco.GregorianCalendar") )
{
	/**
	 * @class GregorianCalendar
	 * @classdesc 날짜 계산 처리들을 가지는 객체
	*/
	JsNamespace.declareClass("Eco.GregorianCalendar", {
		statics: {
			DAYS_IN_MONTH: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
			getDefaultRefDt: function()
			{
				if ( this._defaultRefDt == null || this._defaultRefDt.getTimezoneOffset() != this._oldTimezoneRef )
				{
					var refdt = new Date();
					refdt.setFullYear(2000, 0, 1);
					refdt.setHours(0, 0, 0, 0);
					this._oldTimezoneRef = refdt.getTimezoneOffset();
					this._defaultRefDt = refdt;
				}
				return this._defaultRefDt;
			}
		},
		properties: {
			minimalDaysInFirstWeek: {
				value: 1 
				/*
					첫번째 주차에 존재해야 할 최소 일수
				*/
			},
			firstDayOfWeek: {
				value: 0 //주차 결정에 첫번재 요일 값 (0 ~ 6)
			}
		},
		floor: function(dt, unit, precision, refDt)
		{
			switch(unit)
			{
				case TimeUnit.MILLISECOND:
					return this._floorToMillisecond(dt, precision, refDt);
				case TimeUnit.SECOND:
					return this._floorToSecond(dt, precision, refDt);
				case TimeUnit.MINUTE:
					return this._floorToMinute(dt, precision, refDt);
				case TimeUnit.HOUR:
					return this._floorToHour(dt, precision, refDt);
				case TimeUnit.HOUR_CALENDAR:
					return this._floorToHourCalendar(dt, precision, refDt);
				case TimeUnit.DAY:
					return this._floorToDay(dt, precision, refDt);
				case TimeUnit.WEEK:
					return this._floorToWeek(dt, precision, refDt);
				case TimeUnit.MONTH:
					return this._floorToMonth(dt, precision, refDt);
				case TimeUnit.QUARTER:
					return this._floorToMonth(dt, precision * 3, refDt);
				case TimeUnit.HALFYEAR:
					return this._floorToMonth(dt, precision * 6, refDt);
				case TimeUnit.YEAR:
					return this._floorToYear(dt, precision, refDt);
				case TimeUnit.DECADE:
					return this._floorToYear(dt, precision * 10, refDt);
				default:
					Eco.Logger.error("unknown.timeunit(" + unit.toString() + ")");
					break;
			}
		},
		round: function(dt, unit, precision, refDt)
		{
			return this.floor(new Date(dt.getTime() + dt.getMilliseconds() * precision / 2), unit, precision, refDt);
		},
		_floorToMillisecond: function(dt, precision, refDt)
		{
			if (refDt == null)
			{
				refDt = GregorianCalendar.getDefaultRefDt();
			}
			var elapsed = this.getElapsedMilliseconds(refDt, dt),
				milliseconds;
			if (refDt.getTime() < dt.getTime())
			{
				milliseconds = precision * Math.floor(elapsed / precision);
			}
			else if (refDt.getTime() == dt.getTime())
			{
				milliseconds = 0;
			}
			else
			{
				milliseconds = (-precision) * (1 + Math.floor((-elapsed) / precision));
			}
			return new Date(refDt.getTime() + milliseconds);
		},
		_floorToSecond: function(dt, precision, refDt)
		{
			if (refDt == null)
			{
				refDt = GregorianCalendar.getDefaultRefDt();
			}
			var elapsed = this.getElapsedSeconds(refDt, dt),
				seconds;
			if (refDt.getTime() < dt.getTime())
			{
				seconds = precision * Math.floor(elapsed / precision);
			}
			else if (refDt.getMilliseconds() == dt.getMilliseconds())
			{
				seconds = precision * Math.floor(elapsed / precision);
			}
			else
			{
				seconds = (-precision) * (1 + Math.floor((-elapsed) / precision));
			}
			return new Date(refDt.getTime() + seconds * TimeUnit.SECOND.milliseconds);
		},
		_floorToMinute: function(dt, precision, refDt)
		{
			if (refDt == null)
			{
				refDt = GregorianCalendar.getDefaultRefDt();
			}
			var elapsed = this.getElapsedMinutes(refDt, dt),
				minutes;
			if (refDt.getTime() < dt.getTime())
			{
				minutes = precision * Math.floor(elapsed / precision);
			}
			else if (refDt.getSeconds() == dt.getSeconds() &&
					 refDt.getMilliseconds() == dt.getMilliseconds())
			{
				minutes = precision * Math.floor(elapsed / precision);
			}
			else
			{
				minutes = (-precision) * (1 + Math.floor((-elapsed) / precision));
			}
			return new Date(refDt.getTime() + minutes * TimeUnit.MINUTE.milliseconds);
		},
		_floorToHour: function(dt, precision, refDt)
		{
			if (refDt == null)
			{
				refDt = GregorianCalendar.getDefaultRefDt();
			}
			var elapsed = this.getElapsedHours(refDt, dt),
				hour;
			if ( refDt.getTime() < dt.getTime() )
			{
				hour = refDt.getHours() + (precision * Math.floor(elapsed / precision));
			}
			else if (refDt.getMinutes() == dt.getMinutes() &&
					 refDt.getSeconds() == dt.getSeconds() &&
					 refDt.getMilliseconds() == dt.getMilliseconds())
			{
				hour = refDt.getHours() + (precision * Math.floor(elapsed / precision));
			}
			else
			{
				hour = refDt.getHours() - (precision * (1 + Math.floor((-elapsed) / precision)));
			}
			return new Date(refDt.getTime() + hour * TimeUnit.HOUR.milliseconds);
		},
		_floorToHourCalendar: function(dt, precision, refDt)
		{
			if (refDt == null)
			{
				refDt = GregorianCalendar.getDefaultRefDt();
			}
			var hours = refDt.getHours() + dt.getHours() - dt.getHours() % precision;
			var resDt = new Date();
			resDt.setFullYear(dt.getFullYear(), dt.getMonth(), dt.getDate());
			resDt.setHours(hours, dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds());
			return resDt;
		},
		_floorToDay: function(dt, precision, refDt)
		{
			if (precision == 1 && refDt == null)
			{
				var resDt = new Date();
				resDt.setFullYear(dt.getFullYear(), dt.getMonth(), dt.getDate());
				resDt.setHours(0, 0, 0, 0);
				return resDt;
			}
			return this._floorToDayWithReferenceDate(dt, precision, refDt);
		},
		_floorToDayWithReferenceDate: function(dt, precision, refDt)
		{
			if (refDt == null)
			{
				refDt = GregorianCalendar.getDefaultRefDt();
			}
			if (precision == 1)
			{
				var resDt = new Date();
				resDt.setFullYear(dt.getFullYear(), dt.getMonth(), dt.getDate());
				resDt.setHours(dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds());
				return resDt;
			}
			var elapsed = this.getElapsedDays(refDt, dt),
				days;
			if (refDt.getTime() < dt.getTime())
			{
				days = refDt.getDate() + precision * Math.floor(elapsed / precision);
			}
			else if (refDt.getHours() == dt.getHours() &&
					refDt.getMinutes() == dt.getMinutes() &&
					refDt.getSeconds() == dt.getSeconds() &&
					refDt.getMilliseconds() == dt.getMilliseconds())
			{
				days = refDt.getDate() + precision * Math.floor(elapsed / precision);
			}
			else
			{
				days = refDt.getDate() - precision * (1 + Math.floor((-elapsed) / precision));
			}
			var resDt = new Date();
			resDt.setFullYear(refDt.getFullYear(), refDt.getMonth(), days);
			resDt.setHours(refDt.getHours(), refDt.getMinutes(), refDt.getSeconds(), refDt.getMilliseconds());
			return resDt;
		},
		_floorToWeek: function(dt, precision, refDt)
		{
			var nW = this.getWeek(dt);
			var nQ = nW - (nW - 1) % precision;
			if (nQ < 1)
			{
				nQ = 1;
			}
			var nGap = 7 * (nW - nQ) + this.getRelativeDayOfWeek(dt);
			var resDt;

			if ( refDt == null )
			{
				refDt = GregorianCalendar.getDefaultRefDt();
				resDt = new Date(dt.getTime());
				resDt = this._addDays(resDt, -nGap, true);
				resDt.setHours(refDt.getHours(), refDt.getMinutes(), refDt.getSeconds(), refDt.getMilliseconds());
				return resDt;
			}

			resDt = new Date(dt.getTime());
			resDt.setFullYear(dt.getFullYear(), dt.getMonth(), dt.getDate() - nGap);
			resDt.setHours(dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds());
			return resDt;
		},
		_floorToMonth: function(dt, precision, refDt)
		{
			if (refDt == null)
			{
				refDt = GregorianCalendar.getDefaultRefDt();
			}
			var elapsed = this.getElapsedMonths(refDt, dt),
				months;
			if (refDt.getTime() < dt.getTime())
			{
				months = refDt.getMonth() + precision * Math.floor(elapsed / precision);
			}
			else if (refDt.getDate() == dt.getDate() &&
					refDt.getHours() == dt.getHours() &&
					refDt.getMinutes() == dt.getMinutes() &&
					refDt.getSeconds() == dt.getSeconds() &&
					refDt.getMilliseconds() == dt.getMilliseconds())
			{
				months = refDt.getMonth() + precision * Math.floor(elapsed / precision);
			}
			else
			{
				months = refDt.getMonth() - precision * (1 + Math.floor((-elapsed) / precision));
			}
			var resDt = new Date();
			resDt.setFullYear(refDt.getFullYear(), months, refDt.getDate());
			resDt.setHours(refDt.getHours(), refDt.getMinutes(), refDt.getSeconds(), refDt.getMilliseconds());
			return resDt;
		},
		_floorToYear: function(dt, precision, refDt)
		{
			if (precision == 1 && refDt == null)
			{
				var resDt = new Date();
				resDt.setFullYear(dt.getFullYear(), 0, 1);
				resDt.setHours(0, 0, 0, 0);
				return resDt;
			}
			return this._floorToYearWithReferenceDate(dt, precision, refDt);
		},
		_floorToYearWithReferenceDate: function(dt, precision, refDt)
		{
			if (refDt == null)
			{
				refDt = GregorianCalendar.getDefaultRefDt();
			}
			var elapsed = this.getElapsedYears(refDt, dt),
				years;
			if (refDt.getTime() < dt.getTime())
			{
				years = refDt.getFullYear() + precision * Math.floor(elapsed / precision);
			}
			else if (refDt.getMonth() == dt.getMonth() &&
					refDt.getDate() == dt.getDate() &&
					refDt.getHours() == dt.getHours() &&
					refDt.getMinutes() == dt.getMinutes() &&
					refDt.getSeconds() == dt.getSeconds() &&
					refDt.getMilliseconds() == dt.getMilliseconds())
			{
				years = refDt.getFullYear() + precision * Math.floor(elapsed / precision);
			}
			else
			{
				years = refDt.getFullYear() - precision * (1 + Math.floor((-elapsed) / precision));
			}
			var resDt = new Date();
			resDt.setFullYear(years, refDt.getMonth(), refDt.getDate());
			resDt.setHours(refDt.getHours(), refDt.getMinutes(), refDt.getSeconds(), refDt.getMilliseconds());
			return resDt;
		},
		addUnits: function(dt, unit, incVal, isNotClone)
		{
			if ( isNotClone === undefined ) isNotClone = false;
			switch(unit)
			{
				case TimeUnit.MILLISECOND:
				case TimeUnit.SECOND:
				case TimeUnit.MINUTE:
				case TimeUnit.HOUR:
					return this._addConstantUnits(dt, unit, incVal, isNotClone);
				case TimeUnit.HOUR_CALENDAR:
					return this._addHoursCalendar(dt, incVal, isNotClone);
				case TimeUnit.DAY:
					return this._addDays(dt, incVal, isNotClone);
				case TimeUnit.WEEK:
					return this._addDays(dt, incVal * 7, isNotClone);
				case TimeUnit.MONTH:
					return this._addMonths(dt, incVal, isNotClone);
				case TimeUnit.QUARTER:
					return this._addMonths(dt, incVal * 3, isNotClone);
				case TimeUnit.HALFYEAR:
					return this._addMonths(dt, incVal * 6, isNotClone);
				case TimeUnit.YEAR:
					return this._addYears(dt, incVal, isNotClone);
				case TimeUnit.DECADE:
					return this._addYears(dt, incVal * 10, isNotClone);
				default:
					Eco.Logger.error("unknown.timeunit(" + unit.toString() + ")");
					break;
			}
		},
		_addConstantUnits: function(dt, unit, incVal, isNotClone)
		{
			if (isNotClone)
			{
				dt.setTime(dt.getTime() + unit.milliseconds * incVal);
				return dt;
			}
			return new Date(dt.getTime() + unit.milliseconds * incVal);
		},
		_addHoursCalendar: function(dt, incVal, isNotClone)
		{
			var resDt = isNotClone ? (dt) : (new Date(dt.getTime()));
			resDt.setHours(dt.getHours() + incVal);
			return resDt;
		},
		_addDays: function(dt, incVal, isNotClone)
		{
			var dt = isNotClone ? (dt) : (new Date(dt.getTime()));
			var offset0 = dt.getTimezoneOffset();
			dt.setTime(dt.getTime() + incVal * TimeUnit.DAY.milliseconds);
			var offset1 = dt.getTimezoneOffset();
			if (offset1 != offset0)
			{
				dt.setTime(dt.getTime() + (offset1 - offset0) * TimeUnit.MINUTE.milliseconds);
			}
			return dt;
		},
		_addMonths: function(dt, incVal, isNotClone)
		{
			var dt = isNotClone ? (dt) : (new Date(dt.getTime()));
			dt.setMonth(dt.getMonth() + incVal);
			return dt;
		},
		_addYears: function(dt, incVal, isNotClone)
		{
	//trace("====================================================");
	//trace(Eco.Logger._getCallStackString(GregorianCalendar.prototype._addYears)); //이 함수가 호출되는 stack 확인하여 debug이 용이하다.
			dt = isNotClone ? (dt) : (new Date(dt.getTime()));
			var y = dt.getFullYear() + incVal;
			dt.setFullYear(y);
			return dt;
		},
		getWeek: function(dt, refDt)
		{
			var minimalDay = this.minimalDaysInFirstWeek;
			var lsDt0 = this.getLastDayOfWeek(dt);
			var lsDt1 = this._floorToYear(lsDt0, 1, refDt);
			if (this.getDays(lsDt1, lsDt0) + 1 < minimalDay)
			{
				lsDt1 = this._addYears(lsDt1, -1, true);
			}
			lsDt1 = this._addDays(lsDt1, minimalDay--, false);
			lsDt1 = this.getLastDayOfWeek(lsDt1, true);
			return 1 + Math.round((lsDt0.getTime() - lsDt1.getTime()) / TimeUnit.WEEK.milliseconds);
		},
		getDaysInYear: function(nYear)
		{
			return this.isLeapYear(nYear) ? (366) : (365);
		},
		getDayOfYear: function(dt)
		{
			var nMon = dt.getMonth();
			var nDay = Eco.date._dayOfYearOffset[nMon] + dt.getDate();
			if (nMon > 1 && this.isLeapYear(dt.getFullYear()))
			{
				nDay = nDay + 1;
			}
			return nDay;
		},
		getHoursInDay: function(dt)
		{
			var dt0 = this.floor(dt, TimeUnit.DAY, 1);
			return Math.floor((dt.getTime() - dt0.getTime()) / TimeUnit.HOUR.milliseconds);
		},
		getQuarter: function(dt)
		{
			return Math.floor(dt.getMonth() / 3) + 1;
		},
		getHalfYear: function(dt)
		{
			return dt.getMonth() < 6 ? (1) : (2);
		},
		getDecade: function(dt)
		{
			return Math.floor(dt.getFullYear() / 10);
		},
		isLeapYear: function(nYear)
		{
			if (nYear % 400 == 0)
			{
				return true;
			}
			if (nYear % 100 == 0)
			{
				return false;
			}
			if (nYear % 4 == 0)
			{
				return true;
			}
			return false;
		},
		getDaysInMonth: function(month, year)
		{
			var day = GregorianCalendar.DAYS_IN_MONTH[month];
			if (month == 1 && this.isLeapYear(year))
			{
				day = day + 1;
			}
			return day;
		},
		getDays: function(dt0, dt1)
		{
			if (dt0 > dt1)
			{
				var tmpdt = dt1;
				dt1 = dt0;
				dt0 = tmpdt;
			}
			var nDay = this.getDayOfYear(dt1) - this.getDayOfYear(dt0);
			var nYear0 = dt0.getFullYear();
			var nYear1 = dt1.getFullYear();
			while (nYear0++ < nYear1)
			{
				nDay = nDay + this.getDaysInYear(nYear0);
			}
			return nDay;
		},
		getUnitValue: function(dt, unit, refDt)
		{
			if (refDt == null)
			{
				return this.getPredefinedUnitValue(dt, unit);
			}
			return this._getShiftedUnitValue(dt, unit, refDt);
		},
		getPredefinedUnitValue: function(dt, unit)
		{
			switch(unit)
			{
				case TimeUnit.MILLISECOND:
					return dt.getMilliseconds();
				case TimeUnit.SECOND:
					return dt.getSeconds();
				case TimeUnit.MINUTE:
					return dt.getMinutes();
				case TimeUnit.HOUR:
					return this.getHoursInDay(dt);
				case TimeUnit.HOUR_CALENDAR:
					return dt.getHours();
				case TimeUnit.DAY:
					return dt.getDate();
				case TimeUnit.WEEK:
					return this.getWeek(dt);
				case TimeUnit.MONTH:
					return dt.getMonth();
				case TimeUnit.QUARTER:
					return this.getQuarter(dt);
				case TimeUnit.HALFYEAR:
					return this.getHalfYear(dt);
				case TimeUnit.YEAR:
					return dt.getFullYear();
				case TimeUnit.DECADE:
					return this.getDecade(dt);
				default:
					Eco.Logger.error("unknown.timeunit(" + unit.toString() + ")");
					break;
			}
		},
		_getShiftedUnitValue: function(dt, unit, refDt)
		{
			if (unit == TimeUnit.WEEK)
			{
				return this.getWeek(dt, refDt);
			}
			if (this._previousStartOfYear == null || this._previousStartOfYear.getTime() != refDt.getTime())
			{
				this._previousStartOfYear = new Date(refDt.getTime());
				var dt0 = new Date();
				dt0.setFullYear(1999, refDt.getMonth(), refDt.getDate());
				dt0.setHours(0, 0, 0, 0);
				var dt1 = new Date();
				dt1.setFullYear(1999, 0, 1);
				dt1.setHours(0, 0, 0, 0);
				this._previousStartOfYearOffset = dt0.getTime() - dt1.getTime();
			}
			var retVal = dt.getTime() - this._previousStartOfYearOffset;
			if (this.isLeapYear(dt.getFullYear()) && dt.getMonth() > 1)
			{
				retVal = retVal - 24 * 3600 * 1000;
			}
			return this.getPredefinedUnitValue(new Date(retVal), unit);
		},
		getElapsedUnits: function(dt0, dt1, unit)
		{
			switch(unit)
			{
				case TimeUnit.MILLISECOND:
					return this.getElapsedMilliseconds(dt0, dt1);
				case TimeUnit.SECOND:
					return this.getElapsedSeconds(dt0, dt1);
				case TimeUnit.MINUTE:
					return this.getElapsedMinutes(dt0, dt1);
				case TimeUnit.HOUR:
					return this.getElapsedHours(dt0, dt1);
				case TimeUnit.HOUR_CALENDAR:
					return this.getElapsedCalendarHours(dt0, dt1);
				case TimeUnit.DAY:
					return this.getElapsedDays(dt0, dt1);
				case TimeUnit.WEEK:
					return this.getElapsedWeeks(dt0, dt1);
				case TimeUnit.MONTH:
					return this.getElapsedMonths(dt0, dt1);
				case TimeUnit.QUARTER:
					return this.getElapsedQuarters(dt0, dt1);
				case TimeUnit.HALFYEAR:
					return this.getElapsedHalfYears(dt0, dt1);
				case TimeUnit.YEAR:
					return this.getElapsedYears(dt0, dt1);
				case TimeUnit.DECADE:
					return this.getElapsedDecades(dt0, dt1);
				default:
					Eco.Logger.error("unknown.timeunit(" + unit.toString() + ")");
					break;
			}
		},
		getElapsedMilliseconds: function(dt0, dt1)
		{
			var notSwap = true;
			if (dt0 > dt1)
			{
				var tmpdt = dt1;
				dt1 = dt0;
				dt0 = tmpdt;
				notSwap = false;
			}
			var elapsed = dt1.getTime() - dt0.getTime();
			return notSwap ? (elapsed) : (-elapsed);
		},
		getElapsedSeconds: function(dt0, dt1)
		{
			var notSwap = true;
			if (dt0 > dt1)
			{
				var tmpdt = dt1;
				dt1 = dt0;
				dt0 = tmpdt;
				notSwap = false;
			}
			var elapsed = dt1.getTime() - dt0.getTime();
			elapsed = Math.floor(elapsed / 1000);
			return notSwap ? (elapsed) : (-elapsed);
		},
		getElapsedMinutes: function(dt0, dt1)
		{
			var notSwap = true;
			if (dt0 > dt1)
			{
				var tmpdt = dt1;
				dt1 = dt0;
				dt0 = tmpdt;
				notSwap = false;
			}
			var elapsed = dt1.getTime() - dt0.getTime();
			elapsed = Math.floor(elapsed / (60 * 1000));
			return notSwap ? (elapsed) : (-elapsed);
		},
		getElapsedHours: function(dt0, dt1)
		{
			var notSwap = true;
			if (dt0 > dt1)
			{
				var tmpdt = dt1;
				dt1 = dt0;
				dt0 = tmpdt;
				notSwap = false;
			}
			var elapsed = dt1.getTime() - dt0.getTime();
			elapsed = Math.floor(elapsed / (60 * 60 * 1000));
			return notSwap ? (elapsed) : (-elapsed);
		},
		getElapsedCalendarHours: function(dt0, dt1)
		{
			var notSwap = true;
			if (dt0 > dt1)
			{
				var tmpdt = dt1;
				dt1 = dt0;
				dt0 = tmpdt;
				notSwap = false;
			}
			var elapsed = this.getElapsedHours(dt0, dt1);
			var timezone = dt1.getTimezoneOffset() - dt0.getTimezoneOffset();
			timezone = Math.floor(timezone / 60);
			elapsed = elapsed - timezone;
			return notSwap ? (elapsed) : (-elapsed);
		},
		getElapsedDays: function(dt0, dt1, fractdigit)
		{
			var notSwap = true;
			if (dt0 > dt1)
			{
				var tmpdt = dt1;
				dt1 = dt0;
				dt0 = tmpdt;
				notSwap = false;
			}
			var elapsed = dt1.getTime() - dt0.getTime() + TimeUnit.MINUTE.milliseconds * (-dt1.getTimezoneOffset() + dt0.getTimezoneOffset());
			if ( fractdigit > 0 )
			{
				elapsed = Math.floor(elapsed / TimeUnit.DAY.milliseconds, fractdigit);
			}
			else
			{
				elapsed = Math.floor(elapsed / TimeUnit.DAY.milliseconds);
			}
			return notSwap ? (elapsed) : (-elapsed);
		},
		getElapsedWeeks: function(dt0, dt1)
		{
			var notSwap = true;
			if (dt0 > dt1)
			{
				var tmpdt = dt1;
				dt1 = dt0;
				dt0 = tmpdt;
				notSwap = false;
			}
			var elapsed = this.getElapsedDays(dt0, dt1);
			elapsed = Math.floor(elapsed / 7);
			return notSwap ? (elapsed) : (-elapsed);
		},
		getElapsedMonths: function(dt0, dt1)
		{
			var notSwap = true;
			if (dt0 > dt1)
			{
				var tmpdt = dt1;
				dt1 = dt0;
				dt0 = tmpdt;
				notSwap = false;
			}
			var elapsed = 12 * (dt1.getFullYear() - dt0.getFullYear());
			elapsed = elapsed + (dt1.getMonth() - dt0.getMonth());
			if (dt1.getDate() < dt0.getDate() && dt1.getDate() != this.getDaysInMonth(dt0.getMonth(), dt0.getFullYear()))
			{
				elapsed--;
			}
			else if (dt1.getDate() == dt0.getDate() && this._getTimeOfDayInMillis(dt1) < this._getTimeOfDayInMillis(dt0))
			{
				elapsed--;
			}
			return notSwap ? (elapsed) : (-elapsed);
		},
		getElapsedQuarters: function(dt0, dt1)
		{
			var notSwap = true;
			if (dt0 > dt1)
			{
				var tmpdt = dt1;
				dt1 = dt0;
				dt0 = tmpdt;
				notSwap = false;
			}
			var elapsed = this.getElapsedMonths(dt0, dt1);
			elapsed = Math.floor(elapsed / 3);
			return notSwap ? (elapsed) : (-elapsed);
		},
		getElapsedHalfYears: function(dt0, dt1)
		{
			var notSwap = true;
			if (dt0 > dt1)
			{
				var tmpdt = dt1;
				dt1 = dt0;
				dt0 = tmpdt;
				notSwap = false;
			}
			var elapsed = this.getElapsedMonths(dt0, dt1);
			elapsed = Math.floor(elapsed / 6);
			return notSwap ? (elapsed) : (-elapsed);
		},
		getElapsedYears: function(dt0, dt1)
		{
			var notSwap = true;
			if (dt0 > dt1)
			{
				var tmpdt = dt1;
				dt1 = dt0;
				dt0 = tmpdt;
				notSwap = false;
			}
			var elapsed;
			if (dt0.getFullYear() == dt1.getFullYear())
			{
				elapsed = 0;
			}
			else
			{
				elapsed = dt1.getFullYear() - dt0.getFullYear();
				var day1 = this._getDayOfLeapYear(dt1);
				var day0 = this._getDayOfLeapYear(dt0);
				if (day1 < day0)
				{
					elapsed--;
				}
				else if (day1 == day0 && this._getTimeOfDayInMillis(dt1) < this._getTimeOfDayInMillis(dt0))
				{
					elapsed--;
				}
			}
			return notSwap ? (elapsed) : (-_elapsed);
		},
		_getDayOfLeapYear: function(dt)
		{
			var month = dt.getMonth();
			var day = GregorianCalendar.DAYS_OF_THE_YEAR_OFFSET[month] + dt.getDate();
			if (month > 1)
			{
				day = day + 1;
			}
			return day;
		},
		getElapsedDecades: function(dt0, dt1)
		{
			var notSwap = true;
			if (dt0 > dt1)
			{
				var tmpdt = dt1;
				dt1 = dt0;
				dt0 = tmpdt;
				notSwap = false;
			}
			var elapsed = this.getElapsedYears(dt0, dt1);
			elapsed = Math.floor(elapsed / 10);
			return notSwap ? (elapsed) : (-elapsed);
		},
		getLastDayOfWeek: function(dt, isNotClone)
		{
			if ( isNotClone === undefined ) isNotClone = false;
			return this._addDays(dt, 6 - this.getRelativeDayOfWeek(dt), isNotClone);
		},
		getRelativeDayOfWeek: function(dt)
		{
			var day = dt.getDay();
			var nGap = day - this.firstDayOfWeek;
			if (nGap < 0)
			{
				nGap = nGap + 7;
			}
			return nGap;
		},
		_getTimeOfDayInMillis: function(dt)
		{
			var millisec = dt.getTime() - dt.getTimezoneOffset() * TimeUnit.MINUTE.milliseconds;
			millisec = millisec % TimeUnit.DAY.milliseconds;
			if (millisec < 0)
			{
				millisec = millisec + TimeUnit.DAY.milliseconds;
			}
			return millisec;
		}
	}); //end of 'JsNamespace.declareClass("GregorianCalendar", {'
} //end of 'if ( !JsNamespace.exist("GregorianCalendar") )'

