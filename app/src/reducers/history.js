import * as ActionTypes from '../actions'

export const history = (state = [], action) => {
    
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
            "body": "Aye, tough mermaids are the lot of them!"
        },
        {
            "collection":"history",
            "id": "121236d7-0skk-sjdk-ajds-j432sdjs38838",
            "datetime":"12431232133",
            "referenceid":"9f3f7b7b-a28d-470e-8ba5-a60222e55200",
            "type": "comment",
            "user":"Capt Jack Sparrow",
            "body": "And that was done without a single drop of rum… STOP BLOWING HOLES IN MY SHIP!!! you know, thats the 2nd time I’v watched that man sail away with my ship."
        },
        {
            "collection":"history",
            "id": "121236d7-0skk-sjdk-ajds-j432sdjs38838",
            "datetime":"12431232133",
            "referenceid":"9f3f7b7b-a28d-470e-8ba5-a60222e55200",
            "type": "comment",
            "user":"Blak Sam",
            "body": "Not all treasure is silver and gold mate!"
        }
    ]

    if (action.type === ActionTypes.FETCHLINES_SUCCESS) {
        return action.response.Items
    } else if (action.type === ActionTypes.APPENDLINE_SUCCESS) {
        return state
    }
    return state
}
