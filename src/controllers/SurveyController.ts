import { RouterContext } from "../deps.ts";
import Survey from "../models/Survey.ts";
import BaseSurveyController from "./BaseSurveyController.ts";
import User from "../models/User.ts";

class SurveyController extends BaseSurveyController {
  async getAllForUser(ctx: RouterContext): Promise<void> {
    const user = ctx.state.user as User;
    const surveys = await Survey.findByUser(user.id);
    ctx.response.body = surveys;
  }
  async getSingle(ctx: RouterContext): Promise<void> {
    const id = ctx.params.id!;
    const survey = await this.findSurveyOrFail(id, ctx);
    if (survey) {
      ctx.response.body = survey;
    }
  }
  async create(ctx: RouterContext): Promise<void> {
    const body = ctx.request.body();
    const { name, description } = await body.value;
    if (!name || !description) {
      ctx.response.status = 422;
      ctx.response.body = {
        message: "Please provide name and description",
      };
      return;
    }
    const user = ctx.state.user as User;
    const newSurvey = new Survey(user.id, name, description);
    await newSurvey.create();
    ctx.response.status = 201;
    ctx.response.body = newSurvey;
  }
  async update(ctx: RouterContext) {
    const id = ctx.params.id!;
    const survey = await this.findSurveyOrFail(id, ctx);
    if (survey) {
      const body = ctx.request.body();
      const { name, description } = await body.value;
      await survey.update({ name, description });
      ctx.response.body = survey;
    }
  }
  async delete(ctx: RouterContext) {
    const id: string = ctx.params.id!;
    const survey = await this.findSurveyOrFail(id, ctx);
    if (survey) {
      await survey.delete();
      ctx.response.status = 204;
    }
  }
}
const surveyController = new SurveyController();
export default surveyController;
