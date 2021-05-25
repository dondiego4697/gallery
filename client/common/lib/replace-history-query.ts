import {History} from 'history';
import * as qs from 'query-string';

export function replaceHistoryQuery(history: History, query: any) {
    history.replace(`${history.location.pathname}?${qs.stringify(query)}`);
}

export function parseHistoryQuery<T>(history: History) {
    return (qs.parse(history.location.search) as unknown) as T;
}
