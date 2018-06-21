import React, { Component } from 'react'

export default class GalleryItem extends Component {
  getHref() {
    const { item, params } = this.props
    if (item.url) {
      return item.url
    } else if (params && item.nodeType && item.id) {
      return '#/clouds/'+params.cloudName+'/'+item.nodeType+'/'+item.id
    } else {
      return ''
    }
  }
  getImage() {
    const { item, images } = this.props
    let img = null
    if (images) {
      if (item.preview) {
        img = (<img className="thumbnail img-responsive" src={item.preview} role="presentation"></img>)
      } else {
        img = (<img className="thumbnail img-responsive" src={'img/600x350white.png'} role="presentation"></img>)
      }
    }
    return img
  }
  render() {
    const { item, itemSize } = this.props
    let galleryItemClass = 'item-small col-lg-2 col-md-3 col-sm-6 col-xs-12'
    if (itemSize === 'medium') {
      galleryItemClass = 'item-medium col-lg-3 col-md-4 col-sm-6 col-xs-12'
    } else if (itemSize === 'large') {
      galleryItemClass = 'item-large col-lg-6 col-md-6 col-sm-12 col-xs-12'
    }
    return (
      <div className={'gallery-item-wrapper ' + galleryItemClass}>
        <a href={this.getHref()}>
          <div className={'results-item gallery-item'}>
            <span className='hidden results-item-filter-text'>{item.title + ' ' + item.description}</span>
            <h4 className='gallery-item-title'>{item.title}</h4>
            <div className='gallery-item-preview'>
              {this.getImage()}
            </div>
          </div>
        </a>
      </div>
    )
  }
}
