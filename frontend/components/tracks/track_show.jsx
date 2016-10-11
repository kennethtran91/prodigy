import React from 'react';
import { Link } from 'react-router';
import AnnotationFormContainer from './annotation/annotation_form_container';
import AnnotationItem from './annotation/annotation_item';
import AnnotationShowContainer from './annotation/annotation_show_container';

class TrackShow extends React.Component{

  constructor(props){
    super(props);
    this.state = {annotating: false, annotationIndices:[], body:"", selectedAnnotation:null, location: null, startLoc: null, endLoc: null};
    this.handleSelection = this.handleSelection.bind(this);
    this.generateLyricsAnnotations = this.generateLyricsAnnotations.bind(this);
    this.handleAnnotationClick = this.handleAnnotationClick.bind(this);
    this.closeShowForm = this.closeShowForm.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  handleMouseDown(e){
    this.setState({startLoc:e.pageY});
  }

  handleSelection(e){
    e.preventDefault();
    const selection = document.getSelection().toString();
    if (selection.length > 0 && this.props.currentUser){

      if (
      document.getSelection().anchorNode !==
      document.getSelection().focusNode ||
      document.getSelection().anchorNode.parentElement.className === 'annotated-lyric'){
        return;
      }

      let startIdx = document.getSelection().anchorOffset;
      let endIdx = document.getSelection().focusOffset;
      let span = document.getSelection().anchorNode.parentElement;

      if (startIdx > endIdx) {
        const temp = startIdx;
        startIdx = endIdx;
        endIdx = temp;
      }
      while (span.previousSibling) {
        startIdx += span.previousSibling.innerText.length;
        endIdx += span.previousSibling.innerText.length;
        span = span.previousSibling;
      }
      this.setState({annotating:true, annotationIndices:[startIdx, endIdx], endLoc: e.pageY});
    } else {
      this.setState({annotating:false, annotationIndices:[], selectedAnnotation:null, startLoc: null, endLoc: null});
    }
  }

  closeShowForm(e){
    this.setState({annotating:false, annotationIndices:[], selectedAnnotation:null, startLoc: null, endLoc: null});
  }

  handleAnnotationClick(annotation, e){
    this.setState({selectedAnnotation:annotation, location: e.pageY});
  }

  generateLyricsAnnotations() {

    let lyrics =(<span>{this.props.track.lyrics}</span>);

    let lyricsDiv = [];
    let startIdx = 0;
    let endIdx = 0;
    this.props.track.annotations.forEach((annotation) => {
      lyricsDiv.push(<span className="non-annotated-lyric">
        { this.props.track.lyrics.slice(startIdx, annotation.start_idx) }
      </span>);
      lyricsDiv.push(
        <span className="annotated-lyric" onClick={ this.handleAnnotationClick.bind(null, annotation) }>
          {this.props.track.lyrics.slice(annotation.start_idx, annotation.end_idx) }
        </span>);
      startIdx = annotation.end_idx;
    });

    lyricsDiv.push(<span className="non-annotated-lyric">
      { this.props.track.lyrics.slice(startIdx, this.props.track.lyrics.length) }
    </span>);
    return lyricsDiv;
  }


  render(){

    let rightCol;
    if (this.state.annotating){
      rightCol = (
        <div className="track-show-right-col">
          <AnnotationFormContainer indices={this.state.annotationIndices} callback={ this.closeShowForm }
            location= {(this.state.startLoc + this.state.endLoc)/2 }/>
        </div> );
    }
    else if (this.state.selectedAnnotation){
      rightCol = (
        <div className="track-show-right-col">
          <AnnotationShowContainer annotation={this.state.selectedAnnotation} location= {this.state.location}/>
        </div> );
    } else {
      rightCol = (<div className="track-show-right-col">
        <span className="track-show-description">{this.props.track.description}</span>
        { this.state.annotating ?
          <AnnotationFormContainer indices={this.state.annotationIndices}
            location= {(this.state.startLoc + this.state.endLoc)/2 }/> : <p></p>}
        </div>);
    }



    if (this.props.track.title){
      const header = (<header className="track-show-header">
        <img src= { window.prodigyAssets.defaultImage } className="track-show-bg track-show-gradient"></img>
        <div className="track-show-header-content">
          <h1>{this.props.track.title}</h1>
          <h2>{this.props.track.artist}</h2>
        </div>
        { !this.state.selectedAnnotation && !this.state.annotating ?
          <img src={ window.prodigyAssets.defaultImage } className="track-show-header-album"></img> : <p></p>}
      </header>);


      return(
        <section>
          { header }
          <main className="track-show-wrapper">
            <section className="track-show-content cf">
              <div className="track-show-lyrics" onMouseUp={this.handleSelection} onMouseDown={this.handleMouseDown}>
                { this.generateLyricsAnnotations() }
              </div>
              { rightCol }
            </section>
          </main>
        </section>
    );
    }else{
      return(<h1></h1>);
    }

  }
}


export default TrackShow;



// <form id= "annotation-form" className="annotation-form-hidden">
//   <label>Annotation</label>
//   <textarea></textarea>
//   <input type="submit"></input>
// </form>
