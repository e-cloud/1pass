import { extractCoreDomain } from './domainExtractor'
import * as octopus from './mvo/octopus'
import model from './mvo/model'

model.domain = extractCoreDomain()

octopus.init(model);
