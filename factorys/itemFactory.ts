import { faker } from "@faker-js/faker"

export default async function itemFactory() {
    const item = {
        title: faker.lorem.paragraph(2),
        url: faker.internet.url(),
        description: faker.lorem.paragraph(1),
        amount: parseInt(faker.finance.amount()),
    }

    return item
}
