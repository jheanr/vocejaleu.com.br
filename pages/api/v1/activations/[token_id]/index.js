import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import features from "infra/constants/features.js";
import activation from "models/activation.js";

const router = createRouter();
router.use(controller.injectAnonymousOrUser);
router.patch(
  controller.canRequest(features.READ_ACTIVATION_TOKEN),
  patchHandler,
);

export default router.handler(controller.errorHandlers);

async function patchHandler(request, response) {
  const activationTokenId = request.query.token_id;
  const validActivationToken =
    await activation.findOneValidById(activationTokenId);
  const usedActivationToken =
    await activation.markTokenAsUsed(activationTokenId);

  await activation.activateUserByUserId(validActivationToken.user_id);

  return response.status(200).json(usedActivationToken);
}
