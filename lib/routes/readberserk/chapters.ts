import type { Data, DataItem, Route } from '@/types';
import ofetch from '@/utils/ofetch';
import { load } from 'cheerio';
import { parseDate } from '@/utils/parse-date';

export const route: Route = {
    path: '/',
    categories: ['other'],
    example: '/readberserk',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    radar: [
        {
            source: ['readberserk.com'],
            target: '/',
        },
    ],
    name: 'Berserk Chapters',
    maintainers: ['elibroftw'],
    handler: async (): Promise<Data> => {
        const link = 'https://readberserk.com/';
        const response = await ofetch(link);
        const $ = load(response);

        const items: DataItem[] = $('table tbody tr')
            .toArray()
            .map((item) => {
                const $item = $(item);
                const title = $item.find('td:first-child').text().trim();
                const dateText = $item.find('td:nth-child(2)').text().trim();
                const link = $item.find('td:nth-child(3) a').attr('href');

                return {
                    title,
                    link: link || '',
                    pubDate: parseDate(dateText, 'MMM DD, YYYY'),
                };
            });

        return {
            title: 'Berserk Chapters',
            link,
            description: 'Latest Berserk Chapters',
            item: items,
            author: 'Kentaro Miura',
        };
    },
};
