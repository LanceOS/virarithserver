// import { PUBLIC_ENABLED_LOGGERS } from '$env/static/public';
// import chalk from 'chalk';

// export interface ISentry {
// 	debug(...args: unknown[]): void;
// 	info(...args: unknown[]): void;
// 	error(...args: unknown[]): void;
// 	success(...args: unknown[]): void;
// 	warn(...args: unknown[]): void;
// 	group(label: string): void;
// 	groupEnd(): void;
// 	table(tabularData: unknown, properties?: string[]): void;
// }

// export class SentryBase {
// 	private static enabled: string[] = JSON.parse(PUBLIC_ENABLED_LOGGERS || '[]');

// 	private static isEnabled(loggerLevel: string): boolean {
// 		if (this.enabled.length === 0) return false;
// 		return this.enabled.includes(loggerLevel);
// 	}

// 	private static logWithColor(colorFn: chalk.Chalk, label: string, ...args: unknown[]): void {
// 		console.log(colorFn(`[${label}]`), ...args);
// 	}

// 	static debug(...args: unknown[]): void {
// 		if (!SentryBase.isEnabled('debug')) return;
// 		this.logWithColor(chalk.gray, 'DEBUG', ...args);
// 	}

// 	static success(...args: unknown[]): void {
// 		if (!SentryBase.isEnabled('debug')) return;
// 		this.logWithColor(chalk.green, 'SUCCESS', ...args);
// 	}

// 	static info(...args: unknown[]): void {
// 		if (!SentryBase.isEnabled('info')) return;
// 		this.logWithColor(chalk.blue, 'INFO', ...args);
// 	}

// 	static warn(...args: unknown[]): void {
// 		if (!SentryBase.isEnabled('warn')) return;
// 		this.logWithColor(chalk.yellow, 'WARN', ...args);
// 	}

// 	static error(...args: unknown[]): void {
// 		if (!SentryBase.isEnabled('error')) return;
// 		this.logWithColor(chalk.red, 'ERROR', ...args);
// 	}

// 	static group(label: string): void {
// 		if (!SentryBase.isEnabled('debug')) return;
// 		console.group(chalk.cyan(`[GROUP: ${label}]`));
// 	}

// 	static groupEnd(): void {
// 		console.groupEnd();
// 	}

// 	static table(tabularData: unknown, properties?: string[]): void {
// 		if (!SentryBase.isEnabled('debug')) return;
// 		console.table(tabularData, properties);
// 	}
// }

// // Ensure Logger adheres to ILogger statically
// const Sentry: ISentry = {
// 	debug: SentryBase.debug.bind(SentryBase),
// 	success: SentryBase.success.bind(SentryBase),
// 	info: SentryBase.info.bind(SentryBase),
// 	warn: SentryBase.warn.bind(SentryBase),
// 	error: SentryBase.error.bind(SentryBase),
// 	group: SentryBase.group.bind(SentryBase),
// 	groupEnd: SentryBase.groupEnd.bind(SentryBase),
// 	table: SentryBase.table.bind(SentryBase)
// };

// export default Sentry;