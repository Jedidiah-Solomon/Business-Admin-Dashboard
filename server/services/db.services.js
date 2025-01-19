import User from "../models/User.js";
import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import Transaction from "../models/Transaction.js";
import OverallStat from "../models/OverallStat.js";
import AffiliateStat from "../models/AffiliateStat.js";
import {
  dataUser,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat,
} from "../data/index.js";

import Config from "../models/Config.js";

export const insertData = async () => {
  try {
    const config = await Config.findOne();

    if (!config || config.firstRun) {
      console.log("Inserting data...");

      const isUserCollectionEmpty = (await User.countDocuments()) === 0;
      const isProductCollectionEmpty = (await Product.countDocuments()) === 0;
      const isProductStatCollectionEmpty =
        (await ProductStat.countDocuments()) === 0;
      const isTransactionCollectionEmpty =
        (await Transaction.countDocuments()) === 0;
      const isOverallStatCollectionEmpty =
        (await OverallStat.countDocuments()) === 0;
      const isAffiliateStatCollectionEmpty =
        (await AffiliateStat.countDocuments()) === 0;

      if (
        isUserCollectionEmpty ||
        isProductCollectionEmpty ||
        isProductStatCollectionEmpty ||
        isTransactionCollectionEmpty ||
        isOverallStatCollectionEmpty ||
        isAffiliateStatCollectionEmpty
      ) {
        console.log("Inserting data...");

        if (isUserCollectionEmpty) {
          await User.insertMany(dataUser);
          console.log("User data inserted successfully!");
        }

        if (isProductCollectionEmpty) {
          await Product.insertMany(dataProduct);
          console.log("Product data inserted successfully!");
        }

        if (isProductStatCollectionEmpty) {
          await ProductStat.insertMany(dataProductStat);
          console.log("ProductStat data inserted successfully!");
        }

        if (isTransactionCollectionEmpty) {
          await Transaction.insertMany(dataTransaction);
          console.log("Transaction data inserted successfully!");
        }

        if (isOverallStatCollectionEmpty) {
          await OverallStat.insertMany(dataOverallStat);
          console.log("OverallStat data inserted successfully!");
        }

        if (isAffiliateStatCollectionEmpty) {
          await AffiliateStat.insertMany(dataAffiliateStat);
          console.log("AffiliateStat data inserted successfully!");
        }

        if (!config) {
          await Config.create({ firstRun: false });
        } else {
          config.firstRun = false;
          await config.save();
        }
      } else {
        console.log(
          "Data has already been inserted or collections are not empty."
        );
      }
    } else {
      console.log(
        "Data has already been inserted or collections are not empty."
      );
    }
  } catch (error) {
    console.log("Error inserting data:", error.message);
  }
};
