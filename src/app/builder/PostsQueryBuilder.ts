import mongoose, { FilterQuery, Query, Aggregate } from "mongoose";

class PostsQueryBuilder<T> {
  public modelQuery: Query<T[], T> | Aggregate<T[]>;
  public query?: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T> | Aggregate<T[]>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query || {};
  }

  search(searchFields: string[]) {
    const searchTerm = this.query?.searchTerm as string;
    if (searchTerm) {
      const searchConditions = searchFields.map(
        (field) =>
          ({
            [field]: { $regex: searchTerm, $options: "i" },
          }) as FilterQuery<T>
      );

      // Use match for Aggregation pipelines
      if (this.modelQuery instanceof mongoose.Aggregate) {
        this.modelQuery = this.modelQuery.match({
          $or: searchConditions,
        });
      } else {
        this.modelQuery = (this.modelQuery as Query<T[], T>).find({
          $or: searchConditions,
        });
      }
    }
    return this;
  }

  filter(isAdmin = false) {
    const queryObj = { ...this.query };
    const excludeFields = [
      "searchTerm",
      "sort",
      "limit",
      "page",
      "fields",
      "startDate",
      "endDate",
      "isBlocked",
      "isDeleted",
    ];
    excludeFields.forEach((el) => delete queryObj[el]);

    if (this.query?.category) {
      queryObj.category = this.query.category;
    }

    if (this.query?.tags) {
      queryObj.tags = { $in: this.query.tags };
    }

    if (this.query?.premium !== undefined) {
      queryObj.premium = this.query.premium === "true";
    }

    if (isAdmin) {
      if (this.query?.isBlocked !== undefined) {
        queryObj.isBlocked = this.query.isBlocked === "true";
      }
      if (this.query?.isDeleted !== undefined) {
        queryObj.isDeleted = this.query.isDeleted === "true";
      }
    }

    if ((this.query?.startDate && typeof this.query.startDate === 'string') && (this.query?.endDate && typeof this.query.endDate === 'string')) {
      queryObj.createdAt = {
        ...(this.query.startDate ? { $gte: new Date(this.query.startDate) } : {}),
        ...(this.query.endDate ? { $lte: new Date(this.query.endDate) } : {}),
      };
    }

    if (this.query?.authorId) {
      queryObj.authorId = this.query.authorId;
    }

    // Apply filters depending on whether this is a Query or Aggregate
    if (this.modelQuery instanceof mongoose.Aggregate) {
      this.modelQuery = this.modelQuery.match(queryObj);
    } else {
      this.modelQuery = (this.modelQuery as Query<T[], T>).find(queryObj as FilterQuery<T>);
    }

    return this;
  }

  sort() {
    const sortQuery = this.query?.sort as string;
    if (sortQuery) {
      const sortOptions: Record<string, 1 | -1> = {};
      sortQuery.split(",").forEach((fieldOrder) => {
        const [field, order] = fieldOrder.split(":");
        sortOptions[field] = order === "asc" ? 1 : -1;
      });
      this.modelQuery = this.modelQuery.sort(sortOptions);
    }
    return this;
  }

  paginate() {
    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields = (this.query?.fields as string)?.split(",")?.join(" ") || "-__v";

    // Check if modelQuery is a Query
    if (this.modelQuery instanceof mongoose.Query) {
      this.modelQuery = this.modelQuery.select(fields);
    }

    return this;
  }
}

export default PostsQueryBuilder;
