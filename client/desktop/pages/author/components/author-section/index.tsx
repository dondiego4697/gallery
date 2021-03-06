import {inject, observer} from 'mobx-react';
import * as React from 'react';

import {LoadableDataStatus} from 'common/const';
import {AuthorPageModel} from 'common/models/author-page';
import {AboutAuthorSection} from 'desktop/components/about-author-section';
import {Skeleton} from 'desktop/components/skeleton';

interface Props {
    authorPageModel?: AuthorPageModel;
}

export const AuthorSection = inject('authorPageModel')(
    observer((props: Props) => {
        const {authorPageModel} = props;

        if (!authorPageModel) {
            return <div />;
        }

        const {author: authorData} = authorPageModel;

        if (authorData.status === LoadableDataStatus.LOADING) {
            return <Skeleton style={{width: 1200, margin: '80px auto'}} />;
        }

        const {author} = authorData;

        return (
            <AboutAuthorSection
                author={{
                    firstName: author.firstName,
                    lastName: author.lastName,
                    professions: author.professions,
                    avatarUrl: author.avatarUrl,
                    bio: author.bio
                }}
            />
        );
    })
);
