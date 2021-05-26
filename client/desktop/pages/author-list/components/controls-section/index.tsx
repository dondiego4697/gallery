import cn from 'classnames';
import {first, last} from 'lodash';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';
import {Devider} from 'desktop/components/devider';
import {InputSearch} from 'desktop/components/input-search';
import {SimpleSelect} from 'desktop/components/simple-select';

import './index.scss';

interface Props {
    initFirstLetter?: string;
    initProfessionCode?: string;
    professions: {
        code: string;
        name: string;
    }[];
    onProfessionChange: (value: string) => void;
    onLetterChange: (value: string) => void;
    onSearchSubmit: (value: string) => void;
}

interface RenderAlphabetParams {
    initFirstLetter?: string;
    alphabet: string[];
    otherAlphabet: string[];
    toggleAlphabet: () => void;
    clickLetter: (letter: string) => void;
}

type AlphabetCode = 'ru' | 'en';

const b = bevis('author-list-page__controls-section');

const RU_ALPHABET = [
    'А',
    'Б',
    'В',
    'Г',
    'Д',
    'Е',
    'Ё',
    'Ж',
    'З',
    'И',
    'Й',
    'К',
    'Л',
    'М',
    'Н',
    'О',
    'П',
    'Р',
    'С',
    'Т',
    'У',
    'Ф',
    'Х',
    'Ц',
    'Ч',
    'Ш',
    'Щ',
    'Э',
    'Ю',
    'Я'
];
const EN_ALPHABET = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
];

function renderAlphabet(params: RenderAlphabetParams) {
    const {initFirstLetter, clickLetter, alphabet, otherAlphabet, toggleAlphabet} = params;

    const [activeLetter, setActiveLetter] = React.useState(initFirstLetter);

    return (
        <div className={b('alphabet-container')}>
            <div
                className={b('alphabet')}
                onClick={(event) => {
                    const target = event.target as HTMLElement;
                    if (target.tagName === 'P') {
                        const letter = target.innerText;

                        clickLetter(letter);
                        setActiveLetter(letter);
                    }
                }}
            >
                {alphabet.map((it, i) => (
                    <p
                        key={`alphabet-${i}`}
                        className={cn({
                            [b('letter')]: true,
                            [b('letter_active')]: it === activeLetter
                        })}
                    >
                        {it}
                    </p>
                ))}
            </div>
            <div className={b('alphabet-toggle')}>
                <p className={b('letter')} onClick={toggleAlphabet}>
                    {[first(otherAlphabet), last(otherAlphabet)].join(' - ')}
                </p>
            </div>
        </div>
    );
}

export function ControlsSection(props: Props) {
    const {
        initFirstLetter,
        initProfessionCode,
        professions,
        onProfessionChange,
        onLetterChange,
        onSearchSubmit
    } = props;

    let initAlphabetCode: AlphabetCode = 'ru';

    if (initFirstLetter && EN_ALPHABET.includes(initFirstLetter.toUpperCase())) {
        initAlphabetCode = 'en';
    }

    const [alphabetCode, setAlphabetCode] = React.useState<AlphabetCode>(initAlphabetCode);

    const alphabet = alphabetCode === 'ru' ? RU_ALPHABET : EN_ALPHABET;
    const otherAlphabet = alphabetCode === 'ru' ? EN_ALPHABET : RU_ALPHABET;

    return (
        <section className={b()}>
            <div className={b('container')}>
                <SimpleSelect
                    className={b('profession-select')}
                    items={professions.map((it) => ({key: it.code, value: it.name}))}
                    defaultKey={initProfessionCode || undefined}
                    placeholder="Направление"
                    onKeyChange={(value) => onProfessionChange(value)}
                />
                {renderAlphabet({
                    initFirstLetter,
                    alphabet,
                    otherAlphabet,
                    toggleAlphabet: () => setAlphabetCode(alphabetCode === 'ru' ? 'en' : 'ru'),
                    clickLetter: (letter) => onLetterChange(letter)
                })}
                <div className={b('search')}>
                    <InputSearch value={''} onChange={(e) => {}} className={b('search-input')} />
                </div>
            </div>
            <Devider className={b('devider')} />
        </section>
    );
}
