import { forwardRef, InputHTMLAttributes, useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { Icons } from '../ui/Icons';

export interface CalendarProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  mode?: 'single' | 'range';
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  onChange?: (date: Date | Date[] | undefined) => void;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

function isDateDisabled(date: Date, props: CalendarProps): boolean {
  if (props.minDate && date < props.minDate) return true;
  if (props.maxDate && date > props.maxDate) return true;
  if (props.disabledDates && props.disabledDates.some(d => isSameDay(d, date))) return true;
  return false;
}

const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, label, placeholder, error, helperText, mode = 'single', minDate, maxDate, disabledDates, onChange, ...props }, ref) => {
    const [selectedDate, setSelectedDate] = useState<Date | Date[] | undefined>(undefined);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      props.onChange?.(e);
    };

    const handleInputClick = () => {
      setIsOpen(true);
    };

    const handleDateSelect = (date: Date) => {
      if (isDateDisabled(date, { minDate, maxDate, disabledDates })) return;

      if (mode === 'range') {
        const selected = selectedDate as Date[] | undefined;
        if (!selected || selected.length === 2) {
          setSelectedDate([date]);
        } else if (selected.length === 1) {
          const [start] = selected;
          if (date < start) {
            setSelectedDate([date, start]);
          } else {
            setSelectedDate([start, date]);
          }
          setIsOpen(false);
        }
      } else {
        setSelectedDate(date);
        setIsOpen(false);
      }
    };

    const handleInputBlur = () => {
      setTimeout(() => setIsOpen(false), 100);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const prevMonthDays = getDaysInMonth(
      currentMonth.getMonth() === 0 ? currentMonth.getFullYear() - 1 : currentMonth.getFullYear(),
      currentMonth.getMonth() === 0 ? 11 : currentMonth.getMonth() - 1
    );

    const selected = selectedDate as Date | Date[] | undefined;
    const selectedStart = Array.isArray(selected) ? selected[0] : selected;
    const selectedEnd = Array.isArray(selected) ? selected[1] : undefined;

    const isSelected = (date: Date) => {
      if (!selected) return false;
      if (Array.isArray(selected)) {
        return selected.some(d => isSameDay(d, date));
      }
      return isSameDay(selected, date);
    };

    const isInRange = (date: Date) => {
      if (!selectedStart || !selectedEnd) return false;
      return date > selectedStart && date < selectedEnd;
    };

    const weekRows = [];
    let day = 1;
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfMonth) {
          const prevMonthDay = prevMonthDays - firstDayOfMonth + j + 1;
          const date = new Date(
            currentMonth.getMonth() === 0 ? currentMonth.getFullYear() - 1 : currentMonth.getFullYear(),
            currentMonth.getMonth() === 0 ? 11 : currentMonth.getMonth() - 1,
            prevMonthDay
          );
          week.push({ date, isCurrentMonth: false });
        } else if (day > daysInMonth) {
          const nextMonthDay = day - daysInMonth;
          const date = new Date(
            currentMonth.getMonth() === 11 ? currentMonth.getFullYear() + 1 : currentMonth.getFullYear(),
            currentMonth.getMonth() === 11 ? 0 : currentMonth.getMonth() + 1,
            nextMonthDay
          );
          week.push({ date, isCurrentMonth: false });
          day++;
        } else {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          week.push({ date, isCurrentMonth: true });
          day++;
        }
      }
      weekRows.push(week);
      if (day > daysInMonth) break;
    }

    const displayValue = Array.isArray(selected)
      ? selected.map(formatDate).join(' to ')
      : selected
      ? formatDate(selected)
      : inputValue;

    return (
      <div ref={calendarRef} className={cn('relative w-full', className)}>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            readOnly
            className={cn(
              'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
              error && 'border-destructive focus:ring-destructive',
              props.className
            )}
            disabled={props.disabled}
            aria-invalid={!!error}
            {...props}
          />
          <Icons.calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full max-w-sm rounded-lg border border-input bg-background p-3 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                className="p-1 rounded hover:bg-accent text-muted-foreground"
                aria-label="Previous month"
              >
                <Icons.chevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <span className="flex-1 text-center font-medium">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <button
                type="button"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                className="p-1 rounded hover:bg-accent text-muted-foreground"
                aria-label="Next month"
              >
                <Icons.chevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {weekRows.map((week, weekIndex) => (
                week.map(({ date, isCurrentMonth }, dayIndex) => {
                  const disabled = isDateDisabled(date, { minDate, maxDate, disabledDates });
                  const selectedDay = isSelected(date);
                  const inRange = isInRange(date);
                  const isToday = isSameDay(date, today);

                  return (
                    <button
                      key={`${weekIndex}-${dayIndex}`}
                      type="button"
                      onClick={() => !disabled && handleDateSelect(date)}
                      disabled={disabled || !isCurrentMonth}
                      className={cn(
                        'relative h-9 w-9 rounded-full text-sm font-medium transition-colors',
                        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                        disabled && 'opacity-50 cursor-not-allowed',
                        !isCurrentMonth && 'text-muted-foreground/50',
                        selectedDay && 'bg-primary text-primary-foreground',
                        inRange && !selectedDay && 'bg-primary/20 text-primary',
                        isToday && !selectedDay && 'ring-2 ring-primary',
                        !selectedDay && !inRange && !isToday && !disabled && 'hover:bg-accent hover:text-accent-foreground'
                      )}
                      aria-selected={selectedDay}
                      aria-disabled={disabled}
                      aria-label={date.toLocaleDateString()}
                    >
                      {date.getDate()}
                    </button>
                  );
                })
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="mt-1.5 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';

export { Calendar };