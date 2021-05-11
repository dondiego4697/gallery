interface ClassNameGenerator {
    (elementName?: string): string;
}

export function bevis(blockName: string): ClassNameGenerator {
    return (elementNameOrState?: string): string => {
        let className = blockName;

        if (elementNameOrState) {
            className += `__${elementNameOrState}`;
        }

        return className;
    };
}
