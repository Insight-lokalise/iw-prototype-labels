import * as pbi from 'powerbi-client'

export const powerbi = new pbi.service.Service(
  pbi.factories.hpmFactory,
  pbi.factories.wpmpFactory,
  pbi.factories.routerFactory
)

export const tokenType = pbi.models.TokenType.Embed