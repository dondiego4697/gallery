import {AuthorListPageModel} from 'common/models/author-list-page';
import {AuthorPageModel} from 'common/models/author-page';
import {MordaPageModel} from 'common/models/morda-page';
import {ProductPageModel} from 'common/models/product-page';
import {ProfessionModel} from 'common/models/profession';
import {UserModel} from 'common/models/user';

export const userModel = new UserModel();
export const professionModel = new ProfessionModel();

export const mordaPageModel = new MordaPageModel();
export const productPageModel = new ProductPageModel();
export const authorPageModel = new AuthorPageModel();
export const authorListPageModel = new AuthorListPageModel();
