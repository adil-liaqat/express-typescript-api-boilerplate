import chai from 'chai'
import chaiHttp from 'chai-http'
import sinonChai from 'sinon-chai'
import dirtyChai from 'dirty-chai'
import chaiSubset from 'chai-subset'
import deepEqualInAnyOrder from 'deep-equal-in-any-order'

chai.use(chaiHttp)
chai.use(dirtyChai)
chai.use(sinonChai)
chai.use(chaiSubset)
// chai.use(require('chai-asserttype'))
// chai.use(require('chai-as-promised'))
chai.use(deepEqualInAnyOrder)
// chai.use(require('chai-nock'))

export default chai
