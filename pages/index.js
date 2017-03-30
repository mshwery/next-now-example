import React from 'react'
import debounce from 'lodash/debounce'
import marvel from '../lib/marvel'

const styles = {
  base: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
  },
  title: {
    fontSize: '2rem',
    textAlign: 'center'
  },
  input: {
    display: 'block',
    margin: '2rem auto',
    padding: '0 .5rem',
    height: '2.5rem',
    lineHeight: '2.5rem',
    width: '100%',
    maxWidth: '500px',
    fontSize: '16px'
  },
  card: {
    maxWidth: '30%',
    width: '150px',
    margin: '.5rem',
    display: 'flex',
    flexDirection: 'column'
  },
  characters: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  character: {
    name: {
      fontWeight: '500',
      flex: '1 1 auto',
      margin: '.5rem'
    },
    image ({ path, extension }) {
      return {
        display: 'block',
        width: '150px',
        height: '150px',
        overflow: 'hidden',
        backgroundImage: `url(${path}.${extension})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }
    }
  }
}

const Character = (props) => (
  <a href={props.urls.find(url => url.type === 'detail').url}>
    <div style={styles.card}>
      <div style={styles.character.image(props.thumbnail)}/>    
      <span style={styles.character.name}>{props.name}</span>
    </div>
  </a>
)

async function searchCharacters (nameStartsWith) {
  let characters = []

  try {
    const response = await marvel.characters.find({ nameStartsWith })
    characters = response.data.results
  } catch (ex) {
    // do nothing
  }

  return characters
}

class IndexPage extends React.Component {
  constructor(props) {
    super(props)

    this.search = debounce(this.search.bind(this), 300)
    this.state = {
      input: '',
      characters: null
    }
  }
  
  static async getInitialProps () {
    const characters = await searchCharacters()
    
    return {
      characters
    }
  }

  search (value) {
    searchCharacters(value).then(characters => this.setState({ characters }))
  }

  handleChange (event) {
    const input = event.target.value

    console.log(input)
    this.setState({ input })
    this.search(input)
  }

  render () {
    const characters = this.state.characters || this.props.characters || []

    return (
      <div style={styles.base}>
        <h1 style={styles.title}>Marvel Characters</h1>
        <input type='text' placeholder='Search for characters...' style={styles.input} value={this.state.input} onChange={this.handleChange.bind(this)} />
        <div style={styles.characters}>
          {!characters.length &&
            'No characters found.'
          }
          {characters.map((character, index) => (
            <Character key={index} {...character} />
          ))}
        </div>
      </div>
    )
  }
}

export default IndexPage