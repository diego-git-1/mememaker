import React, { useState, useEffect } from 'react'
import qs from 'qs'

import { Wrapper, Card, Templates, Form, Button } from './styles'
import logo from '../../images/logo.svg'

export default function Home() {
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [boxes, setBoxes] = useState([])
  const [generatedMeme, setGeneratedMeme] = useState(null)

  useEffect(() => {
    (async () => {
      const response = await fetch('https://api.imgflip.com/get_memes')
      const { data: { memes } } = await response.json()
      setTemplates(memes)
    })()
  }, [])

  // Currying -> A function that return another function
  const handleInputChange = index => event => {
    const newValues = boxes
    newValues[index] = event.target.value
    setBoxes(newValues)
  }

  const handleSelectTemplate = template => {
    setSelectedTemplate(template)
    setBoxes([])
  }

  const handleSubmit = async event => {
    event.preventDefault()

    const params = qs.stringify({
      template_id: selectedTemplate.id,
      username: 'vikayel543',
      password: 'vikayel543',
      boxes: boxes.map(text => ({ text }))
    })

    const response = await fetch(`https://api.imgflip.com/caption_image?${params}`)
    const { data: { url } } = await response.json()

    setGeneratedMeme(url)
  }

  const handleReset = () => {
    setSelectedTemplate(null)
    setBoxes([])
    setGeneratedMeme(null)
  }

  return (
    <Wrapper>
      <img src={logo} alt="MemeMaker"/>
      <Card>
        {generatedMeme && (
          <>
            <img src={generatedMeme} alt="Generated Meme" />
            <Button type="button" onClick={handleReset}>Criar outro meme</Button>
          </>
        )}

        {!generatedMeme && (
          <>
            <h2>Selecione um template</h2>
            <Templates>
              {templates.map(template => (
                <button 
                  key={template.id} 
                  type="button"
                  onClick={() => handleSelectTemplate(template)}
                  className={template.id === selectedTemplate?.id && 'selected'}
                >
                  <img src={template.url} alt={template.name} />
                </button>
              ))}
            </Templates>

            {selectedTemplate && (
              <>
                <h2>Textos</h2>
                <Form onSubmit={handleSubmit}>
                  {(new Array(selectedTemplate.box_count)).fill('').map((_, index) => (
                    <input
                      key={String(Math.random())}
                      placeholder={`Text #${index + 1}`}
                      onChange={handleInputChange(index)}
                    />
                  ))}

                  <Button type="submit">MakeMyMeme!</Button>
                </Form>
              </>
            )}
          </>
        )}
      </Card>
    </Wrapper>
  )
}