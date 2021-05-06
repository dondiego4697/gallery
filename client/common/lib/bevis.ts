export type State = Record<string, string | boolean | void | number>;

export interface ClassNameGenerator {
    (elementName?: string, state?: State): string;
    (state?: State): string;
}

const PREFIX = 'g-';

export function bevis(blockName: string): ClassNameGenerator {
    return (elementNameOrState?: string | State, stateRaw?: State): string => {
        let className = `${PREFIX}${blockName}`;
        let state: State = {...stateRaw};

        if (elementNameOrState) {
            if (typeof elementNameOrState === 'string') {
                className += `__${elementNameOrState}`;
            } else if (typeof elementNameOrState === 'object') {
                state = elementNameOrState;
            }
        }

        if (state) {
            Object.keys(state).forEach((key) => {
                if (!state) {
                    return;
                }

                if (state[key] === true) {
                    className += ` _${key}`;
                } else if (state[key]) {
                    className += ` _${key}_${state[key]}`;
                }
            });
        }

        return className;
    };
}
