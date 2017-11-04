import DurationFormatter from './duration_formatter'

describe 'DurationFormatter', ->
  it 'should format null', ->
    expect(DurationFormatter.format(null)).to.eql '0 sec'

  it 'should format number', ->
    expect(DurationFormatter.format(15)).to.eql '15 sec'
    expect(DurationFormatter.format(30)).to.eql '30 sec'
    expect(DurationFormatter.format(45)).to.eql '45 sec'
    expect(DurationFormatter.format(60)).to.eql '1 min'
    expect(DurationFormatter.format(90)).to.eql '1 min 30 sec'

  it 'should format decimals', ->
    expect(DurationFormatter.format(10.2)).to.eql '10 sec'
    expect(DurationFormatter.format(59.6)).to.eql '1 min'
