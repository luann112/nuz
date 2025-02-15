import createQuestions from '../../utils/createQuestions'
import print from '../../utils/print'

const getQuestions = (dir: string) => ({
  type: 'confirm',
  name: 'isConfirmed',
  default: true,
  message: `Folder is existed, do you want to override at ${print.link(dir)}?`,
})

const createQuestionsConfirmOverride = async (dir: string) => {
  const questions = getQuestions(dir)

  const results = await createQuestions<{ isConfirmed: boolean }>([questions])
  return results.isConfirmed
}

export default createQuestionsConfirmOverride
