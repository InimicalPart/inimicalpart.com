export default function GrantCode({
	code,
	prefix = "grant-code",
}: {
	code: string;
	prefix?: string;
}) {
	return <code className="inline-flex rounded-md border border-black/10 bg-neutral-100 px-3 py-2 font-mono text-sm dark:border-white/10 dark:bg-neutral-900">{prefix} {code}</code>;
}