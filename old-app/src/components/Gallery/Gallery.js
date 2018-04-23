import React, { Component } from 'react'
import PropTypes from 'prop-types'
import GalleryItem from './GalleryItem'
import './Gallery.css'

export default class Gallery extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    itemSize: PropTypes.string.isRequired,
    images: PropTypes.bool.isRequired,
    colorClass: PropTypes.string,
    params: PropTypes.object
  }
  getGalleryItems() {
    const { items, itemSize, images, params } = this.props
    var galleryItems = []
    if (items.length !== 0) {
      galleryItems = items.map(function(item, index) {
        return <GalleryItem key={index} item={item} itemSize={itemSize} images={images} params={params}></GalleryItem>
      })
    }
    return galleryItems
  }
  render() {
    const { colorClass } = this.props
    return (
        <div className={'gallery ' + colorClass}>
          {this.getGalleryItems()}
        </div>
    )
  }
}
