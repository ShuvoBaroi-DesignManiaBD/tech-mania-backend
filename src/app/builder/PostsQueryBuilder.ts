import { FilterQuery, Query } from "mongoose";

class PostsQueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query?: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query || {};
  }

  search(searchFields: string[]) {
    const searchTerm = this.query?.searchTerm as string;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: "i" },
            }) as FilterQuery<T>
        ),
      });
    }
    return this;
  }

  filter(isAdmin = false) {
    const queryObj = { ...this.query }; // Copy the query object
    const excludeFields = [
      "searchTerm",
      "sort",
      "limit",
      "page",
      "fields",
      "startDate",
      "endDate",
      "isBlocked",
      "isDeleted"
    ];
    excludeFields.forEach((el) => delete queryObj[el]);
  
    // Filtering by category
    if (this.query?.category) {
      queryObj.category = this.query.category;
    }
  
    // Filtering by tags (assuming tags is an array in the schema)
    if (this.query?.tags) {
      queryObj.tags = { $in: this.query.tags };
    }
  
    // Filtering by premium posts
    if (this.query?.premium !== undefined) {
      queryObj.premium = this.query.premium === "true";
    }
  
    // Admin-only filters (isBlocked and isDeleted)
    if (isAdmin) {
      if (this.query?.isBlocked !== undefined) {
        queryObj.isBlocked = this.query.isBlocked === "true";
      }
  
      if (this.query?.isDeleted !== undefined) {
        queryObj.isDeleted = this.query.isDeleted === "true";
      }
    }
  
    // Date range filtering by createdAt (startDate and endDate)
    if ((this.query?.startDate && typeof this.query.startDate === 'string') && (this.query?.endDate && typeof this.query.endDate === 'string')) {
      queryObj.createdAt = {
        ...(this.query.startDate ? { $gte: new Date(this.query.startDate) } : {}),
        ...(this.query.endDate ? { $lte: new Date(this.query.endDate) } : {}),
      };
    }
      
  
    // Filtering by authorId
    if (this.query?.authorId) {
      queryObj.authorId = this.query.authorId;
    }
  
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }
  

  sort() {
    const sortQuery = this.query?.sort as string;

    if (sortQuery) {
      const sortOptions: Record<string, 1 | -1> = {};

      // Split by comma to handle multiple fields
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
    const fields =
      (this.query?.fields as string)?.split(",")?.join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
}

export default PostsQueryBuilder;
