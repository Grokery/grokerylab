import * as ActionTypes from '../actions'

export const history = (state = [], action) => {
    if (action.type === ActionTypes.FETCHLINES_SUCCESS) {
        // TODO data from response
        return state
    } else if (action.type === ActionTypes.APPENDLINE_SUCCESS) {
        return state
    }

    // MOCK
    state = [
        {
            "collection":"history",
            "id": "123456d7-0skk-sjdk-ajds-jaksdjs38838",
            "datetime":"12431232132",
            "referenceid":"7d9fc763-6e00-4921-b4c0-f8f099069f25",
            "type": "comment",
            "user":"Capt Jack Sparrow",
            "body": "Why is the rum always gone?"
        },
        {
            "collection":"history",
            "id": "121236d7-0skk-sjdk-ajds-j432sdjs38838",
            "datetime":"12431232133",
            "referenceid":"9f3f7b7b-a28d-470e-8ba5-a60222e55200",
            "type": "comment",
            "user":"Blak Sam",
            "body": "Aye, tough mermaids are the lot of them"
        }
    ]

    return state
}
