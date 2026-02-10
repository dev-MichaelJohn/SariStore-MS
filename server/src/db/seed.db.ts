import db from "../config/db.config.js";
import { IPersonInsert } from "../service/person.service.js";
import { IOperatorInsert } from "../service/operator.service.js";
import AppResponse from "../lib/response.lib.js";
import { HashPassword } from "../lib/operator.lib.js";
import OperatorService from "../service/operator.service.js";
import PersonService from "../service/person.service.js";
import ProductCategoryService, { IProductCategorySelect } from "../service/productCategory.service.js";

const sariSariCategories = [
  {
    name: "Beverages",
    description: "Soft drinks, bottled water, juice drinks, powdered beverages, and coffee sachets"
  },
  {
    name: "Instant Noodles",
    description: "Pancit canton, cup noodles, and other quick-cook noodle meals"
  },
  {
    name: "Canned Goods",
    description: "Sardines, tuna, corned beef, meat loaf, and other ready-to-eat canned food"
  },
  {
    name: "Snacks",
    description: "Chips, chichirya, biscuits, crackers, and other light snack items"
  },
  {
    name: "Coffee, Sugar & Creamer",
    description: "Coffee mixes, sugar, and creamer—commonly sold in sachets"
  },
  {
    name: "Condiments & Seasonings",
    description: "Soy sauce, vinegar, fish sauce, salt, pepper, and flavoring powders"
  },
  {
    name: "Rice",
    description: "Regular and premium rice varieties sold per kilo or in small quantities"
  },
  {
    name: "Eggs",
    description: "Chicken eggs sold per piece or per tray"
  },
  {
    name: "Personal Care",
    description: "Shampoo sachets, soap, toothpaste, toothbrushes, and deodorant"
  },
  {
    name: "Laundry & Cleaning Supplies",
    description: "Detergent powders, dishwashing liquid, fabric conditioner, and bleach"
  },
  {
    name: "Cigarettes & Tobacco",
    description: "Cigarettes sold per stick or per pack and other tobacco products"
  },
  {
    name: "Alcoholic Beverages",
    description: "Beer, gin, and other small-format alcoholic drinks"
  },
  {
    name: "Frozen Processed Foods",
    description: "Hotdogs, longganisa, tocino, and other frozen goods (if freezer is available)"
  },
  {
    name: "Ice & Ice Candy",
    description: "Bagged ice and locally made frozen treats for daily refreshment"
  },
  {
    name: "Household Essentials",
    description: "Candles, matches, batteries, light bulbs, and basic home-use items"
  },
  {
    name: "School & Office Supplies",
    description: "Ballpens, notebooks, paper, envelopes, and other basic school items"
  },
  {
    name: "Prepaid Load & E-Services",
    description: "Mobile prepaid load, e-wallet cash-in, and basic digital payment services"
  },
  {
    name: "Others / Miscellaneous",
    description: "Small toys, hair accessories, rubber bands, safety pins, face masks, and other assorted everyday items"
  },
];

/**
 * Seeds an operator along with an associated person record within a transaction (to be used in tests and initial setup)
 * 
 * @export
 * @param {IOperatorInsert} operator
 * @param {IPersonInsert} person
 * @return {*}  {Promise<IOperatorInsert>}
 */
export const SeedOperator = async(operator: IOperatorInsert, person: IPersonInsert): Promise<IOperatorInsert> => {
    let newOperator: IOperatorInsert;
    await db.transaction(async(tx) => {
        const personRecord = await PersonService.CreatePersonViaTransaction(person, tx);
        if(!personRecord) throw (AppResponse.InternalServerError("❌ Failed to create person record"));

        operator.password = await HashPassword(operator.password);
        const operatorData = { ...operator, personId: personRecord.id };
        const insertedOperator = await OperatorService.CreateOperatorViaTransaction(operatorData, tx);
        newOperator = insertedOperator!;
        if(!newOperator) throw (AppResponse.InternalServerError("❌ Failed to create operator record"));
    });

    return newOperator!;
};

export const SeedProductCategories = async(): Promise<void> => {
    await db.transaction(async(tx) => {
        Promise.all(sariSariCategories.map((category) => {
            ProductCategoryService.CreateProductCategoryViaTransaction({...category}, tx);
        }));
    });
};
