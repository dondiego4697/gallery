import {Brackets} from 'typeorm';

import {dbManager} from 'app/lib/db-manager';
import {Author} from 'entity/author';
import {getProfessionByCode} from 'entity/profession/api/get-profession-by-code';

interface Params {
    limit: number;
    offset: number;
    searchFirstLetter?: string;
    searchQuery?: string;
    professionCode?: string;
}

export async function getAuthors({limit, offset, searchFirstLetter, searchQuery, professionCode}: Params) {
    const connection = await dbManager.getConnection();

    const profession = professionCode ? await getProfessionByCode(professionCode) : undefined;

    const qb = connection
        .getRepository(Author)
        .createQueryBuilder('athr')
        .leftJoinAndSelect('athr.city', 'city')
        .leftJoinAndSelect('city.country', 'country')
        .leftJoinAndSelect('athr.professions', 'prof')
        .leftJoinAndSelect('athr.products', 'product')
        .leftJoinAndSelect('product.photos', 'productPhoto')
        .where(
            new Brackets((qb) => {
                if (searchQuery) {
                    qb.where('athr.firstName ILIKE :searchQuery', {
                        searchQuery: `%${searchQuery}%`
                    }).orWhere('athr.lastName ILIKE :searchQuery', {searchQuery: `%${searchQuery}%`});
                } else if (searchFirstLetter) {
                    qb.where('athr.lastName ILIKE :searchFirstLetter', {searchFirstLetter: `${searchFirstLetter}%`});
                }
            })
        )
        .andWhere(new Brackets((qb) => qb.where('product.isSold IS FALSE').orWhere('product.isSold IS NULL')))
        .orderBy('athr.firstName', 'ASC')
        .take(limit)
        .skip(offset);

    if (profession) {
        qb.andWhere(
            new Brackets((qb) => {
                qb.where('prof.id = :professionId', {professionId: profession.id}).orWhere('prof.id IS NULL');
            })
        );
    }

    const [authors, totalCount] = await qb.getManyAndCount();

    return {authors, totalCount};
}
