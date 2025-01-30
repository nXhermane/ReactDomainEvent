
export interface IExponentialBackoffStrategy {
    shouldRetry(attempts: number,error: Error): boolean;
    getNextRetryDelay(attempts: number) : number;
}