import type { Exchange, Scholar } from '../../content/schema'
import data from '../../generated/library.json'
export const { scholars, library } = data as unknown as { scholars: Scholar[]; library: Exchange[] }
