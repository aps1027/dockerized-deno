import { surveyCollection } from "../mongo.ts";
import BaseModel from "./BaseModel.ts";
import { ObjectId } from "../deps.ts";

export default class Survey extends BaseModel {
  public id: string = "";
  constructor(
    public userId: string,
    public name: string,
    public description: string,
  ) {
    super();
    this.userId = userId;
    this.name = name;
    this.description = description;
  }
  static async findByUser(userId: string): Promise<Survey[]> {
    const surveys = await surveyCollection.find({ userId });
    return surveys.map((survey: any) => Survey.prepare(survey));
  }

  static async findById(id: string): Promise<Survey | null> {
    try {
      const survey = await surveyCollection.findOne({
        _id: ObjectId(id),
      });
      return Survey.prepare(survey);
    } catch (e) {
      return null;
    }
  }

  static async findOne(params: object) {}

  async create() {
    delete this.id;
    const { $oid } = await surveyCollection.insertOne(this);
    this.id = $oid;
    return this;
  }

  async update({ name, description }: { name: string; description: string }) {
    const { modifiedCount } = await surveyCollection.updateOne(
      { _id: { $oid: this.id } },
      {
        $set: { name, description },
      },
    );
    if (modifiedCount > 0) {
      this.name = name;
      this.description = description;
    }
    return this;
  }

  delete() {
    return surveyCollection.deleteOne({ _id: ObjectId(this.id) });
  }

  protected static prepare(data: any): Survey {
    data = BaseModel.prepare(data);
    const survey = new Survey(data.userId, data.name, data.description);
    survey.id = data.id;
    return survey;
  }
}
