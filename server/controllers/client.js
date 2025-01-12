import getCountryISO3 from "country-iso-2-to-3";
import _ from "lodash";

// Models import
import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

// Get Products
export const getProducts = async (_, res) => {
  try {
    const products = await Product.find();
    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });

        return {
          ...product._doc,
          stat,
        };
      })
    );

    res.status(200).json(productsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get Customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get Transactions
///transactions?page=2&pageSize=10&sort={"field":"userId","sort":"desc"}&search=user
///transactions → { page: 1, pageSize: 20, sort: null, search: "" }
export const getTransactions = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, sort = "{}", search = "" } = req.query;

    // Ensure page starts at 1 (not 0)
    const pageNumber = page < 1 ? 1 : parseInt(page);

    // Sanitize the search term to avoid regex injection
    var safeSearch = _.escapeRegExp(search);

    // Handle sort formatting if provided
    const generateSort = () => {
      try {
        const sortParsed = JSON.parse(sort);
        return sortParsed.field && sortParsed.sort
          ? {
              [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1,
            }
          : {};
      } catch (e) {
        return {}; // Return empty object if sort is invalid or empty
      }
    };

    const sortFormatted = generateSort();

    // Get transactions based on the search term and pagination
    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(safeSearch, "i") } },
        { userId: { $regex: new RegExp(safeSearch, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for the given search term." });
    }

    // Get the total number of matching transactions
    const total = await Transaction.countDocuments({
      $or: [
        { cost: { $regex: new RegExp(safeSearch, "i") } },
        { userId: { $regex: new RegExp(safeSearch, "i") } },
      ],
    });

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Geography
export const getGeography = async (req, res) => {
  try {
    const users = await User.find();

    // Convert country ISO 2 -> ISO 3
    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryISO3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }

      acc[countryISO3]++;

      return acc;
    }, {});

    // format countries to match geography
    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
