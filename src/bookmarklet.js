import { extractCoreDomain } from './domainExtractor'
import model from './mvo/model'
import * as octopus from './mvo/octopus'

model.domain = extractCoreDomain()

octopus.init(model)
