'use client';

import * as React from 'react';
import * as Slot from '@radix-ui/react-slot';
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from 'react-hook-form';
import { cn } from '../../utils/cn';
import { Label } from './Label';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Select } from './Select';
import { Switch } from './Switch';
import { Button } from './Button';

export interface FormFieldContextValue<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
  name: TName;
}

const FormFieldContext = React.createContext<FormFieldContextValue | undefined>(undefined);

export function useFormField<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>() {
  const context = React.useContext(FormFieldContext as React.Context<FormFieldContextValue<TFieldValues, TName>>);
  if (!context) {
    throw new Error('useFormField must be used within <FormField>');
  }
  return context;
}

export interface FormProps<TFieldValues extends FieldValues = FieldValues>
  extends React.ComponentPropsWithoutRef<'form'> {
  onSubmit: (data: TFieldValues) => void;
  defaultValues?: Partial<TFieldValues>;
  children: React.ReactNode;
}

export function Form<TFieldValues extends FieldValues = FieldValues>({
  onSubmit,
  defaultValues,
  children,
  ...props
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...defaultValues}>
      <form onSubmit={onSubmit as any} {...props}>
        {children}
      </form>
    </FormProvider>
  );
}

export interface FormFieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>
  extends ControllerProps<TFieldValues, TName> {}

export function FormField<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
  children,
  ...props
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <Controller {...props}>
      {(field) => (
        <FormFieldContext.Provider value={{ name: props.name }}>
          {children(field)}
        </FormFieldContext.Provider>
      )}
    </Controller>
  );
}

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FormItem({ className, ...props }: FormItemProps) {
  return <div className={cn('space-y-2', className)} {...props} />;
}

export interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {}

export function FormLabel({ className, ...props }: FormLabelProps) {
  const field = useFormField();
  return <Label {...props} className={cn('', className)} htmlFor={field.name} />;
}

export interface FormControlProps extends React.ComponentPropsWithoutRef<typeof Slot> {
  asChild?: boolean;
}

export function FormControl({ className, asChild = true, ...props }: FormControlProps) {
  const field = useFormField();
  return (
    <Slot.Slot
      className={cn('', className)}
      {...props}
      {...(asChild ? { ...field.field } : {})}
    />
  );
}

export interface FormInputProps extends React.ComponentPropsWithoutRef<typeof Input> {}

export function FormInput({ className, ...props }: FormInputProps) {
  const field = useFormField();
  const { error } = field.fieldState;
  
  return (
    <Input
      className={cn('', className)}
      {...field.field}
      {...props}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${field.name}-error` : undefined}
    />
  );
}

export interface FormTextareaProps extends React.ComponentPropsWithoutRef<typeof Textarea> {}

export function FormTextarea({ className, ...props }: FormTextareaProps) {
  const field = useFormField();
  const { error } = field.fieldState;
  
  return (
    <Textarea
      className={cn('', className)}
      {...field.field}
      {...props}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${field.name}-error` : undefined}
    />
  );
}

export interface FormSelectProps extends React.ComponentPropsWithoutRef<typeof Select> {}

export function FormSelect({ className, options, placeholder, ...props }: FormSelectProps) {
  const field = useFormField();
  const { error } = field.fieldState;
  
  return (
    <Select
      className={cn('', className)}
      options={options}
      placeholder={placeholder}
      {...field.field}
      {...props}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${field.name}-error` : undefined}
    />
  );
}

export interface FormSwitchProps extends React.ComponentPropsWithoutRef<typeof Switch> {}

export function FormSwitch({ className, ...props }: FormSwitchProps) {
  const field = useFormField();
  const { error } = field.fieldState;
  
  return (
    <div className="flex items-center gap-2">
      <Switch
        className={cn('', className)}
        checked={field.field.value}
        onCheckedChange={field.field.onChange}
        {...props}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${field.name}-error` : undefined}
      />
    </div>
  );
}

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function FormMessage({ className, children, ...props }: FormMessageProps) {
  const field = useFormField();
  const { error } = field.fieldState;
  
  if (!error) return null;
  
  return (
    <p
      id={`${field.name}-error`}
      className={cn('text-sm text-destructive', className)}
      {...props}
      role="alert"
    >
      {children || error.message}
    </p>
  );
}

export interface FormSubmitProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function FormSubmit({ className, isLoading, children, ...props }: FormSubmitProps) {
  return (
    <Button type="submit" className={cn('', className)} disabled={isLoading} {...props}>
      {isLoading ? 'Submitting...' : children}
    </Button>
  );
}