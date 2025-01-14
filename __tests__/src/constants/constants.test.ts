import { describe } from "node:test";
import { Constants } from "../../../src/constants/constants";
describe("Constants Object",()=> {
    it("Should return 'handler' when i call 'Constants.handlerMetaDataKey'",()=> {
        expect(Constants.handlerMetaDataKey).toBe("handler")
    })
})