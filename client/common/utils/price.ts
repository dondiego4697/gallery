import {chunk} from 'lodash';

export function stringifyPrice(raw: number | string) {
    const reverted = raw.toString().split('').reverse();
    const chunked = chunk(reverted, 3)
        .map((it) => it.reverse())
        .reverse();
    const parts = chunked.map((it) => it.join(''));

    return `${parts.join(' ')} ₽`;
}
