import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export function H1({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<h1
			className={cn(
				"text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl",
				className
			)}
		>
			{children}
		</h1>
	);
}
export function H2({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<h2
			className={cn(
				"pb-2 text-3xl font-semibold tracking-tight border-b scroll-m-20 first:mt-0",
				className
			)}
		>
			{children}
		</h2>
	);
}
export function H3({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<h3
			className={cn(
				"text-2xl font-semibold tracking-tight scroll-m-20",
				className
			)}
		>
			{children}
		</h3>
	);
}
export function H4({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<h4
			className={cn(
				"text-xl font-semibold tracking-tight scroll-m-20",
				className
			)}
		>
			{children}
		</h4>
	);
}
export function P({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>
			{children}
		</p>
	);
}
export function Muted({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<p className={cn(`text-sm text-muted-foreground `, className)}>
			{children}
		</p>
	);
}
export function Small({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<p className={cn("text-sm font-medium leading-none", className)}>
			{children}
		</p>
	);
}
export function Large({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <p className={cn("text-lg font-semibold", className)}>{children}</p>;
}
export function Lead({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<p className={cn("text-xl text-muted-foreground", className)}>
			{children}
		</p>
	);
}
