


// tslint:disable

// types enum

export enum QueryObjectTypes {
	Cp = 'Cp',
	Cps = 'Cps',
}
	

// types
type Int = number
type Boolean = boolean
type String = string

export interface cp {
	x?: Int
	y?: Int
}


export interface cps {
	my?: (cp | undefined)[]
	other?: (cp | undefined)[]
}



// Query props -----------------------------------
interface QueryCpsProps {
	x?: Int
	y?: Int
	r?: Int
}


// Query apis ------------------------------------
export class Query {

	constructor(
    
    private url: string,
    private getHeaders: () => Record<string, string> = () => ({}),
    private fetchGraphql: FetchGraphql = defaultFetchGraphql,
    private gql?: any
    ) { }

	cps(
		props: QueryCpsProps,
		
			fragment: string,
			options?: {} & FragmentOptions,
	) {
	
  
    const mergedOptions = options
      

		
		const fragmentName = mergedOptions?.fragmentName || getFirstFragmentName(this.gql, fragment, '') || 'CpsData'

		const finishedFragment = fragment
		
		// build query
		const query = `
		query cps($x: Int, $y: Int, $r: Int) {
			cps(x: $x, y: $y, r: $r) {
				...${fragmentName}
			}
		}

		${finishedFragment}
		`
    return this.fetchGraphql(
			this.url, 
      query,
      props, 
      this.getHeaders
		).then((result: any) => getResultData<cps>(result, 'cps'))
    
	}
}





// Mutation props -----------------------------------
interface MutationAddProps {
	x?: Int
	y?: Int
}


// Mutation apis ------------------------------------
export class Mutation {

	constructor(
    
    private url: string,
    private getHeaders: () => Record<string, string> = () => ({}),
    private fetchGraphql: FetchGraphql = defaultFetchGraphql,
    private gql?: any
    ) { }

	add(
		props: MutationAddProps,
		
			
			options?: {} ,
	) {
	
  
    const mergedOptions = options
      

		
	// build query
		const mutation = `
		mutation add($x: Int, $y: Int) {
			add(x: $x, y: $y)
		}
		`
    return this.fetchGraphql(
			this.url, 
      mutation,
      props, 
      this.getHeaders
		).then((result: any) => getResultData<Boolean>(result, 'add'))
    
	}
}




// helper types






interface FragmentOptions {
	fragmentName?: string
}




export interface Client {
	query: Query
	
	
	
	mutation: Mutation
	
}


export type FetchGraphql = (
  url: string,
  query: string,
  variables: Object,
  getHeaders: () => Record<string, string>
) => Promise<unknown>

const defaultFetchGraphql: FetchGraphql = (
  url,
  query,
  variables,
  getHeaders
) =>
  fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...getHeaders(),
    },
    body: JSON.stringify({
      operationName: null,
      variables,
      query,
    }),
  }).then((x) => x.json())
    

function getResultData<T>(result: any, dataFieldName: any) {
	// if error, throw it
	if (result.errors) {
		throw new Error(<any>result.errors)
	}

	if (!result.data) {
		return <T><any>null
	}

	// cast the result and return (need any for scalar types, to avoid compilation error)
	return <T><any>result.data[dataFieldName]
}

function getFirstFragmentName(gql: any, fragmentParam: string | Object | undefined, returnClassName: string) {

  const fragment = (typeof fragmentParam === 'string' && gql) 
    ? gql(fragmentParam)
    : (typeof fragmentParam === 'object')
      ? fragmentParam as any
      : null

  if (!fragment) { return }

  const fragmentDef = fragment.definitions.filter(
    (x: any) => x.kind === 'FragmentDefinition' && (!returnClassName || x.typeCondition?.name?.value === returnClassName)
  )[0]

  const fragmentName =
    fragmentDef.kind === 'FragmentDefinition' && fragmentDef?.name?.value

  return fragmentName
}
