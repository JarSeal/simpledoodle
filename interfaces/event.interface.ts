export interface eventType {
    name: string,
    dates: [string],
    votes: [{
        date: string,
        people: [string],
    }],
    id?: string,
}

export interface voteDataType {
    name: string,
    votes: [string],
}