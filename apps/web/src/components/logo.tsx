import { cn } from "@/lib/utils";

export function Logo({
  withLabel = true,
  className,
}: {
  className?: string;
  withLabel?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex items-center font-semibold text-foreground leading-none",
        className,
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary/90 to-orange-500">
        <span className="font-bold text-sm text-primary-foreground">C</span>
      </div>
      {withLabel && (
        <span className="ml-3 text-lg font-semibold">codebasehub</span>
      )}
    </span>
  );
}
