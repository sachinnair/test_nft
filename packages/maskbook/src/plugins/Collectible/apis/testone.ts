import stringify from 'json-stable-stringify'
import { ZORA_GRAPH_API_URL } from '../constants'

import { getZoraProfiles } from '@zoralabs/zdk'

export async function getOwnerProfile(creatorAddress: string, ownerAddress: string) {
    const addresses = [creatorAddress, ownerAddress]
    return getZoraProfiles(addresses)
}

export async function getTransfersFromZora(tokenId: string) {
    const query = `
    query getAuctionsForMedia($skip: Int!, $orderDirection: String!, $id: String) {
      reserveAuctions(
        first: 20
        skip: $skip
        orderBy: id
        orderDirection: $orderDirection
        where: { media: $id }
      ) {
        ...AuctionFragment
      }
    }

    fragment AuctionFragment on ReserveAuction {
      id
      tokenContract
      tokenId
      media {
        id
        owner
        contentURI
        metadataHash
      }
      approved
      duration
      expectedEndTimestamp
      firstBidTime
      reservePrice
      curatorFeePercentage
      tokenOwner {
        id
      }
      curator {
        id
      }
      auctionCurrency {
        ...CurrencyFragment
      }
      status
      currentBid {
        ...AuctionBidFragment
      }
      previousBids {
        ...InactiveAuctionBidFragment
      }
      createdAtTimestamp
      createdAtBlockNumber
      finalizedAtTimestamp
      finalizedAtBlockNumber
    }

    fragment CurrencyFragment on Currency {
      id
      decimals
      symbol
      liquidity
    }


    fragment AuctionBidFragment on ReserveAuctionBid {
      id
      amount
      bidder {
        id
      }
      bidType
      createdAtTimestamp
      createdAtBlockNumber
    }


    fragment InactiveAuctionBidFragment on InactiveReserveAuctionBid {
      id
      amount
      bidder {
        id
      }
      bidType
      bidInactivatedAtTimestamp
      bidInactivatedAtBlockNumber
      createdAtTimestamp
      createdAtBlockNumber
    }

    `

    const variables = { id: tokenId, limit: 10, skip: 0, orderDirection: 'desc' }

    return fetchFromTheGraph<object>(query, variables)
}

export async function fetchMediaInfo(tokenId: string, addOffersFragment?: boolean) {
    const query = `{
        media(id: "${tokenId}") {
          id
          metadataURI
          contentURI
          contentHash
          metadataHash
          owner {
            ownerAddress: id
          }
          ownerBidShare
          creator {
            id
          }
          creatorBidShare
          prevOwner {
            id
          }
          prevOwnerBidShare
          approved {
            id
          }
          ${addOffersFragment ? '...OffersFragment' : ''}
          currentAsk {
            id
          }
          createdAtTimestamp
          createdAtBlockNumber
        }

    }

    fragment OffersFragment on Media {
        currentBids {
            id
            amount
        }
        inactiveBids {
            id
            type
            amount
        }
    }
    `

    return fetchFromTheGraph<object>(query)
}

export async function fetchFromTheGraph<T>(query: string, variables?: object): Promise<T> {
    const zoraData = await (
        await fetch(ZORA_GRAPH_API_URL, {
            method: 'POST',
            mode: 'cors',
            body: stringify({ query, variables }),
        })
    ).json()

    return zoraData
}
