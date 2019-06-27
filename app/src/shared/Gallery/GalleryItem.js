import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class GalleryItem extends Component {
  getHref() {
    const { item, params } = this.props
    if (item.url) {
      return item.url
    } else if (params && item.nodeType && item.id) {
      return '/clouds/'+params.cloudName+'/'+item.nodeType+'/'+item.id
    } else {
      return ''
    }
  }
  getImage() {
    const { item, images } = this.props
    let img = null
    if (images) {
      if (item.preview) {
        img = (<img className="thumbnail img-responsive" src={item.preview} alt="preview"></img>)
      } else {
        img = (<img className="thumbnail img-responsive" src={'img/600x350white.png'} alt="preview"></img>)
      }
    }
    return img
  }
  getIframe = (href) => {
    return (
      <div className='iframe-preview'><a href={href}><iframe src={href}></iframe></a></div>
    )
  }
  render() {
    const { item, itemSize } = this.props
    let galleryItemClass = 'item-small col-lg-2 col-md-3 col-sm-6 col-xs-12'
    if (itemSize === 'medium') {
      galleryItemClass = 'item-medium col-lg-3 col-md-4 col-sm-6 col-xs-12'
    } else if (itemSize === 'large') {
      galleryItemClass = 'item-large col-lg-6 col-md-6 col-sm-12 col-xs-12'
    }
    const href = this.getHref();
    return (
      <div className={'gallery-item-wrapper ' + galleryItemClass}>
        <a href={href}>
          <div className={'paper results-item gallery-item'}>
            <span className='hidden results-item-filter-text'>{item.title + ' ' + item.description}</span>
            {/* <i className='fa fa-tachometer cloud-edit-icon'/> */}
            {!this.props.images && !this.props.iframes ? 
              <h4 className='gallery-item-title'>{item.title}</h4> :  
              <div className='gallery-item-preview'>
                {this.props.images && !this.props.iframes ? this.getImage() : null}
                {this.props.iframes ? <Link to={href}><div style={{position:'absolute',top:0,bottom:0,right:0,left:0,zIndex:'1'}}></div></Link> : null}
                {!this.props.images && this.props.iframes ? this.getIframe(href) : null}
              </div>
            }
          </div>
        </a>
      </div>
    )
  }
}
