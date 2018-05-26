/* eslint-disable radix, no-plusplus */
import model from '../mvo/model'
import * as octopus from '../mvo/octopus'
import { parseQuery } from '../lib/parse-query'

const queryState = parseQuery(location.search)
const isValidState = Object.keys(queryState).length === 4
octopus.initMobile(isValidState ? Object.assign(model, queryState) : model)
