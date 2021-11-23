import { unreachable } from '@dimensiondev/kit'
import {
    currySameAddress,
    EthereumTokenType,
    FungibleTokenDetailed,
    isSameAddress,
    useAccount,
    useChainId,
    useTokenConstants,
} from '@masknet/web3-shared'
import BigNumber from 'bignumber.js'
import { first, head, uniqBy } from 'lodash-es'
import { useAsyncRetry } from 'react-use'
import { getOwnerProfile } from '../apis/testone'
import { OpenSeaAccountURL } from '../constants'
import { toDate, toTokenDetailed, toTokenIdentifier } from '../helpers'
import { PluginCollectibleRPC } from '../messages'
import { CollectibleProvider, CollectibleToken } from '../types'
import { getOrderUnitPrice } from '../utils'
// import { fetchAssetInfo } from '../apis/testone'

// import { Zora } from '@zoralabs/zdk'
// import { Wallet, getDefaultProvider } from 'ethers'

export function useAsset(provider: CollectibleProvider, token?: CollectibleToken) {
    // console.log('TRACK', provider, token)

    const account = useAccount()
    const chainId = useChainId()
    // console.log('chainId', chainId)
    const { WNATIVE_ADDRESS } = useTokenConstants()
    // const walle = useWallet()
    // console.log('walle', walle)
    // const wallet = new Wallet(, getDefaultProvider('mainnet'))
    // console.log('wallet', wallet)

    return useAsyncRetry(async () => {
        if (!token) return
        switch (provider) {
            case CollectibleProvider.OPENSEA:
                const openSeaResponse = await PluginCollectibleRPC.getAsset(token.contractAddress, token.tokenId)
                const desktopOrder = head(
                    (openSeaResponse.sellOrders ?? []).sort(
                        (a, b) =>
                            new BigNumber(getOrderUnitPrice(a) ?? 0).toNumber() -
                            new BigNumber(getOrderUnitPrice(b) ?? 0).toNumber(),
                    ),
                )
                console.log({
                    is_verified: ['approved', 'verified'].includes(
                        openSeaResponse.collection?.safelist_request_status ?? '',
                    ),
                    is_order_weth: isSameAddress(desktopOrder?.paymentToken ?? '', WNATIVE_ADDRESS),
                    is_collection_weth: openSeaResponse.collection.payment_tokens.some(
                        currySameAddress(WNATIVE_ADDRESS),
                    ),
                    is_owner: openSeaResponse.top_ownerships.some((item) => isSameAddress(item.owner.address, account)),
                    // it's an IOS string as my inspection
                    is_auction: Date.parse(`${openSeaResponse.endTime ?? ''}Z`) > Date.now(),
                    image_url: openSeaResponse.imageUrl,
                    asset_contract: openSeaResponse.assetContract,
                    current_price: desktopOrder ? new BigNumber(getOrderUnitPrice(desktopOrder) ?? 0).toNumber() : null,
                    current_symbol: desktopOrder?.paymentTokenContract?.symbol ?? 'ETH',
                    owner: {
                        ...openSeaResponse.owner,
                        link: `${OpenSeaAccountURL}${
                            openSeaResponse.owner?.user?.username ?? openSeaResponse.owner.address ?? ''
                        }`,
                    },
                    creator: {
                        ...openSeaResponse.creator,
                        link: `${OpenSeaAccountURL}${
                            openSeaResponse.creator?.user?.username ?? openSeaResponse.creator?.address ?? ''
                        }`,
                    },
                    token_id: openSeaResponse.tokenId,
                    token_address: openSeaResponse.tokenAddress,
                    traits: openSeaResponse.traits,
                    safelist_request_status: openSeaResponse.collection?.safelist_request_status ?? '',
                    description: openSeaResponse.description,
                    name: openSeaResponse.name ?? openSeaResponse.collection.name,
                    collection_name: openSeaResponse.collection.name,
                    animation_url: openSeaResponse.animation_url,
                    end_time: desktopOrder
                        ? toDate(Number.parseInt(desktopOrder.listingTime as unknown as string, 10))
                        : null,
                    order_payment_tokens: desktopOrder?.paymentTokenContract
                        ? [toTokenDetailed(chainId, desktopOrder.paymentTokenContract)]
                        : [],
                    offer_payment_tokens: uniqBy(
                        openSeaResponse.collection.payment_tokens.map((x) => toTokenDetailed(chainId, x)),
                        (x) => x.address.toLowerCase(),
                    ).filter((x) => x.type === EthereumTokenType.ERC20),
                    order_: desktopOrder,
                    slug: openSeaResponse.collection.slug,
                    response_: openSeaResponse,
                })
                return {
                    is_verified: ['approved', 'verified'].includes(
                        openSeaResponse.collection?.safelist_request_status ?? '',
                    ),
                    is_order_weth: isSameAddress(desktopOrder?.paymentToken ?? '', WNATIVE_ADDRESS),
                    is_collection_weth: openSeaResponse.collection.payment_tokens.some(
                        currySameAddress(WNATIVE_ADDRESS),
                    ),
                    is_owner: openSeaResponse.top_ownerships.some((item) => isSameAddress(item.owner.address, account)),
                    // it's an IOS string as my inspection
                    is_auction: Date.parse(`${openSeaResponse.endTime ?? ''}Z`) > Date.now(),
                    image_url: openSeaResponse.imageUrl,
                    asset_contract: openSeaResponse.assetContract,
                    current_price: desktopOrder ? new BigNumber(getOrderUnitPrice(desktopOrder) ?? 0).toNumber() : null,
                    current_symbol: desktopOrder?.paymentTokenContract?.symbol ?? 'ETH',
                    owner: {
                        ...openSeaResponse.owner,
                        link: `${OpenSeaAccountURL}${
                            openSeaResponse.owner?.user?.username ?? openSeaResponse.owner.address ?? ''
                        }`,
                    },
                    creator: {
                        ...openSeaResponse.creator,
                        link: `${OpenSeaAccountURL}${
                            openSeaResponse.creator?.user?.username ?? openSeaResponse.creator?.address ?? ''
                        }`,
                    },
                    token_id: openSeaResponse.tokenId,
                    token_address: openSeaResponse.tokenAddress,
                    traits: openSeaResponse.traits,
                    safelist_request_status: openSeaResponse.collection?.safelist_request_status ?? '',
                    description: openSeaResponse.description,
                    name: openSeaResponse.name ?? openSeaResponse.collection.name,
                    collection_name: openSeaResponse.collection.name,
                    animation_url: openSeaResponse.animation_url,
                    end_time: desktopOrder
                        ? toDate(Number.parseInt(desktopOrder.listingTime as unknown as string, 10))
                        : null,
                    order_payment_tokens: desktopOrder?.paymentTokenContract
                        ? [toTokenDetailed(chainId, desktopOrder.paymentTokenContract)]
                        : [],
                    offer_payment_tokens: uniqBy(
                        openSeaResponse.collection.payment_tokens.map((x) => toTokenDetailed(chainId, x)),
                        (x) => x.address.toLowerCase(),
                    ).filter((x) => x.type === EthereumTokenType.ERC20),
                    order_: desktopOrder,
                    slug: openSeaResponse.collection.slug,
                    response_: openSeaResponse,
                }
            case CollectibleProvider.RARIBLE:
                const raribleResponse = await PluginCollectibleRPC.getNFTItem(token.contractAddress, token.tokenId)
                console.log('RARIBLE sel')
                const owner = first(raribleResponse?.owners)
                const creator = first(raribleResponse?.creators)
                return {
                    is_order_weth: false,
                    is_collection_weth: false,
                    is_verified: false,
                    is_owner: false,
                    is_auction: false,
                    image_url: raribleResponse?.meta.image.url.PREVIEW,
                    asset_contract: null,
                    owner: owner
                        ? {
                              address: owner,
                              profile_img_url: '',
                              user: { username: owner },
                              link: '',
                          }
                        : null,
                    creator: creator
                        ? {
                              address: creator.account,
                              profile_img_url: '',
                              user: { username: creator.account },
                              link: '',
                          }
                        : null,
                    traits: raribleResponse?.meta.attributes.map(({ key, value }) => ({ trait_type: key, value })),
                    description: raribleResponse?.meta.description ?? '',
                    name: raribleResponse?.meta.name ?? 'Unknown',
                    collection_name: '',
                    animation_url: raribleResponse.meta.animation?.url.PREVIEW,
                    current_price: 0,
                    current_symbol: 'ETH',
                    end_time: null,
                    order_payment_tokens: [] as FungibleTokenDetailed[],
                    offer_payment_tokens: [] as FungibleTokenDetailed[],
                    order_: null,
                    slug: '',
                    response_: raribleResponse,
                }
            case CollectibleProvider.TESTONE:
                console.log('JACK REACHER', PluginCollectibleRPC)
                const zoraData = await PluginCollectibleRPC.fetchMediaInfo(token.tokenId)
                const resp: any = await zoraData
                console.log('resp', resp)
                const {
                    data: {
                        media: {
                            metadataURI,
                            contentURI,
                            owner: { ownerAddress },
                            creator: { id: creatorAddress },
                        },
                    },
                } = resp
                const metaData = await (await fetch(metadataURI)).json()
                // const contentData = await fetch(contentURI)
                // console.log('metaData', metaData)

                const [creatorProfile, ownerProfile] = await getOwnerProfile(creatorAddress, ownerAddress)
                console.log('ownerProfile', ownerProfile)
                // console.log('ZORA DATA', zoraData)
                return {
                    description: metaData.description,
                    name: metaData.name,
                    image_url: contentURI,
                    owner: { ...ownerProfile },
                    creator: { ...creatorProfile },
                }
            default:
                return unreachable(provider)
        }
    }, [toTokenIdentifier(token), account, chainId, provider, WNATIVE_ADDRESS])
}
