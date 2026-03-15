"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  const triggerClassName = cx(
    "flex h-9 min-w-[150px] max-w-[220px] items-center justify-between",
    "gap-2 rounded-xl border border-[#d8cab8] bg-[#fffcf7] px-3 py-2",
    "text-sm text-[#1f1a18] shadow-sm outline-none transition",
    "focus-visible:ring-2 focus-visible:ring-[#ba4b2f]/30",
    "disabled:cursor-not-allowed disabled:opacity-50",
    className,
  );

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={triggerClassName}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-70" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const scrollButtonClassName =
    "flex cursor-default items-center justify-center py-1";

  const contentClassName = cx(
    "relative z-50 max-h-80 min-w-[8rem] overflow-x-hidden overflow-y-auto",
    "rounded-xl border border-[#d8cab8] bg-[#fffdfa] text-[#1f1a18]",
    "shadow-md",
    position === "popper" &&
      "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1",
    position === "popper" &&
      "data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
    className,
  );

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={contentClassName}
        position={position}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className={scrollButtonClassName}>
          <ChevronUp className="h-4 w-4" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport
          className={cx(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full",
            position === "popper" &&
              "min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className={scrollButtonClassName}>
          <ChevronDown className="h-4 w-4" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cx(
        "px-2 py-1.5 text-xs font-medium text-[#665a50]",
        className,
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const itemIndicatorClassName =
    "absolute right-2 flex h-3.5 w-3.5 items-center justify-center";

  const itemClassName = cx(
    "relative flex w-full cursor-default items-center rounded-md",
    "py-1.5 pr-8 pl-2 text-sm outline-none select-none",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    "data-[highlighted]:bg-[#f5e5d0]",
    className,
  );

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={itemClassName}
      {...props}
    >
      <span className={itemIndicatorClassName}>
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cx(
        "bg-[#d8cab8] pointer-events-none -mx-1 my-1 h-px",
        className,
      )}
      {...props}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
