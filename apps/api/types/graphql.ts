export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AWSDateTime: { input: any; output: any; }
  AWSJSON: { input: any; output: any; }
};

export type BattleResult = {
  __typename: 'BattleResult';
  cards: Array<Card>;
  winnerId: Scalars['ID']['output'];
};

export type Card = PersonCard | StarshipCard;

export type Mutation = {
  __typename: 'Mutation';
  deleteCard: Scalars['String']['output'];
  upsertPersonCard: PersonCard;
  upsertStarshipCard: StarshipCard;
};


export type MutationDeleteCardArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpsertPersonCardArgs = {
  card: UpsertPersonCard;
};


export type MutationUpsertStarshipCardArgs = {
  card: UpsertStarshipCard;
};

export type PersonCard = {
  __typename: 'PersonCard';
  battleAttributeName: Scalars['String']['output'];
  battleValue: Scalars['Int']['output'];
  createdAt: Scalars['AWSDateTime']['output'];
  gender: Scalars['String']['output'];
  hair_color: Scalars['String']['output'];
  height: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  mass: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type Query = {
  __typename: 'Query';
  getAllByType: Array<Card>;
  getBattleResult: BattleResult;
  getCardById: Card;
};


export type QueryGetAllByTypeArgs = {
  type: Scalars['String']['input'];
};


export type QueryGetBattleResultArgs = {
  type: Scalars['String']['input'];
};


export type QueryGetCardByIdArgs = {
  id: Scalars['ID']['input'];
};

export type StarshipCard = {
  __typename: 'StarshipCard';
  battleAttributeName: Scalars['String']['output'];
  battleValue: Scalars['Int']['output'];
  cargo_capacity: Scalars['Int']['output'];
  createdAt: Scalars['AWSDateTime']['output'];
  crew: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type UpsertPersonCard = {
  gender: Scalars['String']['input'];
  hair_color: Scalars['String']['input'];
  height: Scalars['Int']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  mass: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type UpsertStarshipCard = {
  cargo_capacity: Scalars['Int']['input'];
  crew: Scalars['Int']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};
