import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {StringParam, useQueryParams} from 'use-query-params';

import {bevis} from 'common/lib/bevis';
import {AuthorListPageModel} from 'common/models/author-list-page';
import {ProfessionModel} from 'common/models/profession';
import {UserModel} from 'common/models/user';
import {Footer} from 'desktop/components/footer';
import {NavBar} from 'desktop/components/navbar';

import {ContentSection} from './components/content-section';
import {ControlsSection} from './components/controls-section';
import {HeaderSection} from './components/header-section';

import './index.scss';

interface Props extends RouteComponentProps {
    userModel?: UserModel;
    authorListPageModel?: AuthorListPageModel;
    professionModel?: ProfessionModel;
}

const b = bevis('author-list-page');

export const AuthorListPage = inject(
    'userModel',
    'authorListPageModel',
    'professionModel'
)(
    observer((props: Props) => {
        const {match, authorListPageModel, professionModel} = props;

        if (!authorListPageModel || !professionModel) {
            return <div />;
        }

        const [query, setQuery] = useQueryParams({
            firstLetter: StringParam,
            text: StringParam,
            professionCode: StringParam
        });

        React.useEffect(() => {
            authorListPageModel.load(query);
        }, []);

        return (
            <div className={b()}>
                <NavBar underline="dark" currentPath={match.path} />
                <HeaderSection />
                <ControlsSection
                    initFirstLetter={query.firstLetter || undefined}
                    initProfessionCode={query.professionCode || undefined}
                    professions={professionModel.professions}
                    onProfessionChange={(professionCode) => {
                        setQuery({professionCode});
                        authorListPageModel.load(query);
                    }}
                    onLetterChange={(firstLetter) => {
                        setQuery({
                            firstLetter,
                            text: undefined
                        });
                        authorListPageModel.load(query);
                    }}
                    onSearchSubmit={() => {
                        setQuery({
                            text: 'some_value',
                            firstLetter: undefined
                        });
                        authorListPageModel.load(query);
                    }}
                />
                <ContentSection />
                <Footer />
            </div>
        );
    })
);
