function Colours({colours}){
    return(
        <>
            <div>{colours}</div>
        </>
    )
}

function Controls({controls}){
    return(
        <>
            <div>{controls}</div>
        </>
    )
}

function Meta({meta}){
    return(
        <>
            <div>{meta.title}</div>
            <div>{meta.type}</div>
            <Controls controls = {meta.controls}/>
        </>
    )
}

function Palette({palette}){
    return(
        <>
            <Meta meta = {palette.meta}/>
            <Colours colours = {palette.colours}/>
        </>
    )
}

function Palettes ( {palettes}) {
    const rows = []

    palettes.forEach((palette) => {
        rows.push(
            <Palette 
                palette = {palette} />
        )

    })
    return (
        <table>
          <thead>
            <tr>
              <th>Header!?</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      );

}
  
  const palettes = [
    {
    "meta": {
        "title": 'palette 1',
        "type": 'categorical',
        "seed": ['123456'],
        "comment": 'Thise is a test comment',
        "controls": [{"name": 'edit', "position": '1', "tooltip": 'edit me'}, {"name": 'delete', "position": '2', "tooltip": 'delete me'}]
        },  
    "colours": [{"value": '#111111', "id": '123456'}, {"value": '#222222', "id": '456789'}]
    },
    {
    "meta": {
        "title": 'palette 2',
        "type": 'sequential',
        "seed": ['123456'],
        "comment": 'Thise is a test comment',
        "controls": [{"name": 'edit', "position": '1', "tooltip": 'edit me'}, {"name": 'delete', "position": '2', "tooltip": 'delete me'}]
    },  
    "colours": [{"value": '#111111', "id": '123456'}, {"value": '#222222', "id": '456789'}]
    },
]

  export default function App() {
    return <Palettes palettes={palettes} />;
  }