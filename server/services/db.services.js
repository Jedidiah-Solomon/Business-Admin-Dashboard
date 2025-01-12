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

// Function to insert data only if collection is empty
export const insertData = async () => {
  try {
    // Check if any collection is empty before inserting data
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

      // Insert each dataset if the corresponding collection is empty
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
    } else {
      console.log(
        "Data has already been inserted or collections are not empty."
      );
    }

    // After checking and inserting data, update the FIRST_RUN flag to false
    process.env.FIRST_RUN = "false";
  } catch (error) {
    console.log("Error inserting data:", error.message);
  }
};
